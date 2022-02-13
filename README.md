# Typescript Express Starter

The application is a simple Express.JS app.

# Local and Production Deployment

Assuming the app is deployed at directory `/home/ubuntu/app`

## Configure the app

Install Node.JS and NPM, and run `npm install` in the project root. Then, copy `config.sample.json` into `config.json` and edit as per your needs.

Create a file `launcher.sh` (chmod+x) in project root with contents as follows:

```sh
#!/bin/bash
export NODE_ENV=production # Comment this line to enable dev-mode.
export PORT=3000
echo "Node.js App starting in " $(pwd)
npm run build
./bin/www
```

This will be used to launch the application in development as well as production.

## Systemd Service for Express Application ( Optional )

Assuming the user the service runs as is named `ubuntu`, create the following service file and save it as `/lib/systemd/system/my-nodejs-app.service`:

```
[Unit]
Description=My Node.JS app
After=network.target

[Service]
Environment=NODE_PORT=3000
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/bash /home/ubuntu/app/launcher.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then, run `systemctl daemon-reload` and then `systemctl enable my-nodejs-app` and then `systemctl start my-nodejs-app` ( all as root ).

## Configure NGINX Reverse Proxy ( systemd ) ( Optional )

First, install NGINX using `sudo apt install nginx`. Create a file `bphc-reviews-proxy.conf` in `/etc/nginx/conf.d`.

In it, write:

```
server {
    listen 80;
    server_name my.domain.name.com;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```

Then, run `systemctl daemon-reload` and then `systemctl enable nginx` and then `systemctl start nginx` ( all as root ).

## Local Debugging

Use `npm run dev` to start nodeman watcher.

# License

This software is licensed under GNU Affero General Public License v3.0 or later.
