



### Old Queries

```
select distinct `scene_markers`.* from `scene_markers`
left join `tags` as `primary_tags_join` on `primary_tags_join`.`id` = `scene_markers`.`primary_tag_id`
left join `scene_markers_tags` as `tags_join` on `tags_join`.`scene_marker_id` = `scene_markers`.`id`
where `primary_tags_join`.`id` in (55) AND `tags_join`.`tag_id` in (3)
group by `scene_markers`.`id`
```


### Generate Cert

https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl/41366949#41366949

openssl req -x509 -newkey rsa:4096 -sha256 -days 7300 -nodes -keyout server.key -out server.crt -extensions san -config <(echo "[req]"; echo distinguished_name=req; echo "[san]"; echo subjectAltName=DNS:stash.server,IP:127.0.0.1,IP:192.168.1.200) -subj /CN=stash.server

download cert from url:7000/server.crt