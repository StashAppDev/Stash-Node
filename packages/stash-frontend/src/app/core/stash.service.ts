import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { ListFilter } from '../shared/models/list-state.model';

import { Apollo, QueryRef } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import * as ActionCable from 'actioncable';
import * as ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';

import * as GQL from './graphql-generated';

@Injectable()
export class StashService {
  public findScenesGQL = new GQL.FindScenesGQL(this.apollo);
  public findSceneGQL = new GQL.FindSceneGQL(this.apollo);
  public findSceneForEditingGQL = new GQL.FindSceneForEditingGQL(this.apollo);
  public findSceneMarkersGQL = new GQL.FindSceneMarkersGQL(this.apollo);
  public sceneWallGQL = new GQL.SceneWallGQL(this.apollo);
  public markerWallGQL = new GQL.MarkerWallGQL(this.apollo);
  public findPerformersGQL = new GQL.FindPerformersGQL(this.apollo);
  public findPerformerGQL = new GQL.FindPerformerGQL(this.apollo);
  public findStudiosGQL = new GQL.FindStudiosGQL(this.apollo);
  public findStudioGQL = new GQL.FindStudioGQL(this.apollo);
  public findGalleriesGQL = new GQL.FindGalleriesGQL(this.apollo);
  public findGalleryGQL = new GQL.FindGalleryGQL(this.apollo);
  public findTagGQL = new GQL.FindTagGQL(this.apollo);
  public markerStringsGQL = new GQL.MarkerStringsGQL(this.apollo);
  public scrapeFreeonesGQL = new GQL.ScrapeFreeonesGQL(this.apollo);
  public scrapeFreeonesPerformersGQL = new GQL.ScrapeFreeonesPerformersGQL(this.apollo);
  public allTagsGQL = new GQL.AllTagsGQL(this.apollo);
  public allTagsForFilterGQL = new GQL.AllTagsForFilterGQL(this.apollo);
  public allPerformersForFilterGQL = new GQL.AllPerformersForFilterGQL(this.apollo);
  public statsGQL = new GQL.StatsGQL(this.apollo);
  public sceneUpdateGQL = new GQL.SceneUpdateGQL(this.apollo);
  public performerCreateGQL = new GQL.PerformerCreateGQL(this.apollo);
  public performerUpdateGQL = new GQL.PerformerUpdateGQL(this.apollo);
  public studioCreateGQL = new GQL.StudioCreateGQL(this.apollo);
  public studioUpdateGQL = new GQL.StudioUpdateGQL(this.apollo);
  public tagCreateGQL = new GQL.TagCreateGQL(this.apollo);
  public tagDestroyGQL = new GQL.TagDestroyGQL(this.apollo);
  public tagUpdateGQL = new GQL.TagUpdateGQL(this.apollo);
  public sceneMarkerCreateGQL = new GQL.SceneMarkerCreateGQL(this.apollo);
  public sceneMarkerUpdateGQL = new GQL.SceneMarkerUpdateGQL(this.apollo);
  public sceneMarkerDestroyGQL = new GQL.SceneMarkerDestroyGQL(this.apollo);
  public metadataImportGQL = new GQL.MetadataImportGQL(this.apollo);
  public metadataExportGQL = new GQL.MetadataExportGQL(this.apollo);
  public metadataScanGQL = new GQL.MetadataScanGQL(this.apollo);
  public metadataGenerateGQL = new GQL.MetadataGenerateGQL(this.apollo);
  public metadataCleanGQL = new GQL.MetadataCleanGQL(this.apollo);

  constructor(private apollo: Apollo, private platformLocation: PlatformLocation, private httpLink: HttpLink) {
    const platform: any = platformLocation;
    const platformUrl = new URL(platform.location.origin);
    platformUrl.port = '7000';
    const url = platformUrl.toString().slice(0, -1);

    // http://graphql-ruby.org/javascript_client/apollo_subscriptions
    const cable = ActionCable.createConsumer(`ws://${platform.location.hostname}:3000/subscriptions`);
    const actionCableLink = new ActionCableLink({cable});

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    });

    const httpLinkHandler = httpLink.create({uri: `${url}/graphql`});

    const splitLink = ApolloLink.split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      actionCableLink,
      httpLinkHandler
    );

    const link = ApolloLink.from([
      errorLink,
      splitLink
    ]);

    apollo.create({
      link: link,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
      },
      cache: new InMemoryCache({
        // dataIdFromObject: o => {
        //   if (o.__typename === "MarkerStringsResultType") {
        //     return `${o.__typename}:${o.title}`
        //   } else {
        //     return `${o.__typename}:${o.id}`
        //   }
        // },

        cacheRedirects: {
          Query: {
            findScene: (rootValue, args, context) => {
              return context.getCacheKey({__typename: 'Scene', id: args.id});
            }
          }
        },
      })
    });
  }

  findScenes(page?: number, filter?: ListFilter): QueryRef<GQL.FindScenes.Query, Record<string, any>> {
    let scene_filter = {};
    if (filter.criteriaFilterOpen) {
      scene_filter = filter.makeSceneFilter();
    }
    if (filter.customCriteria) {
      filter.customCriteria.forEach(criteria => {
        scene_filter[criteria.key] = criteria.value;
      });
    }

    return this.findScenesGQL.watch({
      filter: {
        q: filter.searchTerm,
        page: page,
        per_page: filter.itemsPerPage,
        sort: filter.sortBy,
        direction: filter.sortDirection === 'asc' ? GQL.SortDirectionEnum.Asc : GQL.SortDirectionEnum.Desc
      },
      scene_filter: scene_filter
    });
  }

  findScene(id?: any, checksum?: string) {
    return this.findSceneGQL.watch({
      id: id,
      checksum: checksum
    });
  }

  findSceneForEditing(id?: any) {
    return this.findSceneForEditingGQL.watch({
      id: id
    });
  }

  findSceneMarkers(page?: number, filter?: ListFilter) {
    let scene_marker_filter = {};
    if (filter.criteriaFilterOpen) {
      scene_marker_filter = filter.makeSceneMarkerFilter();
    }
    if (filter.customCriteria) {
      filter.customCriteria.forEach(criteria => {
        scene_marker_filter[criteria.key] = criteria.value;
      });
    }

    return this.findSceneMarkersGQL.watch({
      filter: {
        q: filter.searchTerm,
        page: page,
        per_page: filter.itemsPerPage,
        sort: filter.sortBy,
        direction: filter.sortDirection === 'asc' ? GQL.SortDirectionEnum.Asc : GQL.SortDirectionEnum.Desc
      },
      scene_marker_filter: scene_marker_filter
    });
  }

  sceneWall(q?: string) {
    return this.sceneWallGQL.watch({
      q: q
    },
    {
      fetchPolicy: 'network-only'
    });
  }

  markerWall(q?: string) {
    return this.markerWallGQL.watch({
      q: q
    },
    {
      fetchPolicy: 'network-only'
    });
  }

  findPerformers(page?: number, filter?: ListFilter) {
    let performer_filter = {};
    if (filter.criteriaFilterOpen) {
      performer_filter = filter.makePerformerFilter();
    }
    // if (filter.customCriteria) {
    //   filter.customCriteria.forEach(criteria => {
    //     scene_filter[criteria.key] = criteria.value;
    //   });
    // }

    return this.findPerformersGQL.watch({
      filter: {
        q: filter.searchTerm,
        page: page,
        per_page: filter.itemsPerPage,
        sort: filter.sortBy,
        direction: filter.sortDirection === 'asc' ? GQL.SortDirectionEnum.Asc : GQL.SortDirectionEnum.Desc
      },
      performer_filter: performer_filter
    });
  }

  findPerformer(id: any) {
    return this.findPerformerGQL.watch({
      id: id
    });
  }

  findStudios(page?: number, filter?: ListFilter) {
    return this.findStudiosGQL.watch({
      filter: {
        q: filter.searchTerm,
        page: page,
        per_page: filter.itemsPerPage,
        sort: filter.sortBy,
        direction: filter.sortDirection === 'asc' ? GQL.SortDirectionEnum.Asc : GQL.SortDirectionEnum.Desc
      }
    });
  }

  findStudio(id: any) {
    return this.findStudioGQL.watch({
      id: id
    });
  }

  findGalleries(page?: number, filter?: ListFilter) {
    return this.findGalleriesGQL.watch({
      filter: {
        q: filter.searchTerm,
        page: page,
        per_page: filter.itemsPerPage,
        sort: filter.sortBy,
        direction: filter.sortDirection === 'asc' ? GQL.SortDirectionEnum.Asc : GQL.SortDirectionEnum.Desc
      }
    });
  }

  findGallery(id: any) {
    return this.findGalleryGQL.watch({
      id: id
    });
  }

  findTag(id: any) {
    return this.findTagGQL.watch({
      id: id
    });
  }

  markerStrings(q?: string, sort?: string) {
    return this.markerStringsGQL.watch({
      q: q,
      sort: sort
    });
  }

  scrapeFreeones(performer_name: string) {
    return this.scrapeFreeonesGQL.watch({
      performer_name: performer_name
    });
  }

  scrapeFreeonesPerformers(query: string) {
    return this.scrapeFreeonesPerformersGQL.watch({
      q: query
    });
  }

  allTags() {
    return this.allTagsGQL.watch();
  }

  allTagsForFilter() {
    return this.allTagsForFilterGQL.watch();
  }

  allPerformersForFilter() {
    return this.allPerformersForFilterGQL.watch();
  }

  stats() {
    return this.statsGQL.watch();
  }

  sceneUpdate(scene: GQL.SceneUpdate.Variables) {
    return this.sceneUpdateGQL.mutate({
      id: scene.id,
      title: scene.title,
      details: scene.details,
      url: scene.url,
      date: scene.date,
      rating: scene.rating,
      studio_id: scene.studio_id,
      gallery_id: scene.gallery_id,
      performer_ids: scene.performer_ids,
      tag_ids: scene.tag_ids
    },
    {
      refetchQueries: [
        {
          query: this.findSceneGQL.document,
          variables: {
            id: scene.id
          }
        }
      ]
    });
  }

  performerCreate(performer: GQL.PerformerCreate.Variables) {
    return this.performerCreateGQL.mutate({
      name: performer.name,
      url: performer.url,
      birthdate: performer.birthdate,
      ethnicity: performer.ethnicity,
      country: performer.country,
      eye_color: performer.eye_color,
      height: performer.height,
      measurements: performer.measurements,
      fake_tits: performer.fake_tits,
      career_length: performer.career_length,
      tattoos: performer.tattoos,
      piercings: performer.piercings,
      aliases: performer.aliases,
      twitter: performer.twitter,
      instagram: performer.instagram,
      favorite: performer.favorite,
      image: performer.image
    });
  }

  performerUpdate(performer: GQL.PerformerUpdate.Variables) {
    return this.performerUpdateGQL.mutate({
      id: performer.id,
      name: performer.name,
      url: performer.url,
      birthdate: performer.birthdate,
      ethnicity: performer.ethnicity,
      country: performer.country,
      eye_color: performer.eye_color,
      height: performer.height,
      measurements: performer.measurements,
      fake_tits: performer.fake_tits,
      career_length: performer.career_length,
      tattoos: performer.tattoos,
      piercings: performer.piercings,
      aliases: performer.aliases,
      twitter: performer.twitter,
      instagram: performer.instagram,
      favorite: performer.favorite,
      image: performer.image
    },
    {
      refetchQueries: [
        {
          query: this.findPerformerGQL.document,
          variables: {
            id: performer.id
          }
        }
      ],
    });
  }

  studioCreate(studio: GQL.StudioCreate.Variables) {
    return this.studioCreateGQL.mutate({
      name: studio.name,
      url: studio.url,
      image: studio.image
    });
  }

  studioUpdate(studio: GQL.StudioUpdate.Variables) {
    return this.studioUpdateGQL.mutate({
      id: studio.id,
      name: studio.name,
      url: studio.url,
      image: studio.image
    },
    {
      refetchQueries: [
        {
          query: this.findStudioGQL.document,
          variables: {
            id: studio.id
          }
        }
      ],
    });
  }

  tagCreate(tag: GQL.TagCreate.Variables) {
    return this.tagCreateGQL.mutate({
      name: tag.name
    });
  }

  tagDestroy(tag: GQL.TagDestroy.Variables) {
    return this.tagDestroyGQL.mutate({
      id: tag.id
    });
  }

  tagUpdate(tag: GQL.TagUpdate.Variables) {
    return this.tagUpdateGQL.mutate({
      id: tag.id,
      name: tag.name
    },
    {
      refetchQueries: [
        {
          query: this.findTagGQL.document,
          variables: {
            id: tag.id
          }
        }
      ],
    });
  }

  markerCreate(marker: GQL.SceneMarkerCreate.Variables) {
    return this.sceneMarkerCreateGQL.mutate({
      title: marker.title,
      seconds: marker.seconds,
      scene_id: marker.scene_id,
      primary_tag_id: marker.primary_tag_id,
      tag_ids: marker.tag_ids
    },
    {
      refetchQueries: () => ['FindScene']
    });
  }

  markerUpdate(marker: GQL.SceneMarkerUpdate.Variables) {
    return this.sceneMarkerUpdateGQL.mutate({
      id: marker.id,
      title: marker.title,
      seconds: marker.seconds,
      scene_id: marker.scene_id,
      primary_tag_id: marker.primary_tag_id,
      tag_ids: marker.tag_ids
    },
    {
      refetchQueries: () => ['FindScene']
    });
  }

  markerDestroy(id: any, scene_id: any) {
    return this.sceneMarkerDestroyGQL.mutate({
      id: id
    },
    {
      refetchQueries: () => ['FindScene']
    });
  }

  metadataImport() {
    return this.metadataImportGQL.watch();
  }

  metadataExport() {
    return this.metadataExportGQL.watch();
  }

  metadataScan() {
    return this.metadataScanGQL.watch();
  }

  metadataGenerate() {
    return this.metadataGenerateGQL.watch();
  }

  metadataClean() {
    return this.metadataCleanGQL.watch();
  }

  metadataUpdate() {
    // return this.apollo.subscribe({
    //   query: METADATA_UPDATE_SUBSCRIPTION
    // });
  }

}
