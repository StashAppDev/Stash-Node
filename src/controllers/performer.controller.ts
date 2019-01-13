import express from "express";

export class PerformerController {

  // #region GraphQL Resolvers

  // public static findGallery: QueryResolvers.FindGalleryResolver = async (root, args, context, info) => {
  //   return getEntity(Gallery, { id: args.id });
  // }

  // #endregion

  public static async image(req: express.Request, res: express.Response, next: express.NextFunction) {
    // TODO

    // if stale?(@performer)
    //   type = FileMagic.new(FileMagic::MAGIC_MIME).buffer(@performer.image)
    //
    //   expires_in 1.week
    //   response.headers['Content-Length'] = @performer.image.bytesize.to_s
    //   send_data @performer.image, disposition: 'inline', type: type
    // end
  }
}
