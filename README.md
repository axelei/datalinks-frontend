# DataLinks

DataLinks is a wiki-like application built to be fast and rather simple to use. It's built with React and Spring Boot.

## Features
- Categories support
- CKEditor WYSIWYG editor
- It's very fast!
- Internationalization support

# Nginx example configuration
```
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=files_cache:10m max_size=10g inactive=24h use_temp_path=off;
server {
        root /home/krusher/datalinks.krusher.net;
        index index.html index.htm;
        server_name datalinks.krusher.net;
        listen 80;
        location ^~ /datalinks-backend/ {
                proxy_pass http://localhost:8080/;
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location ^~ /datalinks-backend/file/get/ {
                proxy_pass http://localhost:8080/file/get/;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_cache files_cache;
                proxy_cache_key $request_uri;
                proxy_cache_valid 200 1h;
                proxy_cache_valid 404 10m;
                add_header X-Cache-Status $upstream_cache_status;
                proxy_set_header Host $host;
        }
        location / {
                try_files $uri $uri/ /index.html;
        }
}
```
