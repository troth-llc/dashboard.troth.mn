## Prerequisites

Please make sure that: <br>
[Node.js](https://nodejs.org/en/) <br>
[MongoDB](https://docs.mongodb.com/manual/installation/)<br>
[Nginx](http://nginx.org/en/download.html)<br>
installed on your system. The current Long Term Support **(LTS)** release is an ideal starting point.

## Installation

1. Installing Node

```shell
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

2. Installing Nginx

```shell
sudo apt update
sudo apt install nginx
```

3. Installing MongoDB

```shell
sudo apt update
sudo apt install -y mongodb
sudo systemctl status mongod
```

> You’ll see this output:

    Output
    ● mongod.service - MongoDB Database Server
    Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
    Active: active (running) since Sat 2020-05-23 14:44:01 +08; 1 months 5 days ago
        Docs: https://docs.mongodb.org/manual
    Main PID: 15287 (mongod)
    CGroup: /system.slice/mongod.service
            └─15287 /usr/bin/mongod --config /etc/mongod.conf

4. Download project files & installation

```shell
git clone https://github.com/troth-llc/dashboard.troth.mn
cd dashboard.troth.mn
npm install
npm run seed
cd front
npm install
```

_email:tuguldur@troth.mn,password:password_

5. Configure environment file

```
cp .env.example .env
```

> Environment example

```
JWTSECRET=@
PORT=5000
MONGO=
SENDER_MAIL=
GCLOUD_ID=
GOOGLE_APIS=
VIMEO_ID=
VIMEO_SECRET=
VIMEO_TOKEN=
```

> Example nginx configuration (/etc/nginx/sites-enabled/default)

```
server {
        server_name dashboard.troth.mn;
        location / {
        proxy_pass http://10.140.0.4:5000;
        proxy_set_header Host $host;
        proxy_set_header   X-Forwarded-For $remote_addr;
    }
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/dashboard.troth.mn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.troth.mn/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
server {
    if ($host = dashboard.troth.mn) {
        return 301 https://$host$request_uri;
    }
    listen 80 ;
    listen [::]:80;
    server_name dashboard.troth.mn;
    return 404;
}
```

## Basic structure

This repository has the following structure:

```text
├───front
│   ├───public
│   └───src
│       ├───assets
│       │   ├───css
│       │   ├───fonts
│       │   ├───img
│       │   │   ├───brand
│       │   │   ├───icons
│       │   │   │   └───common
│       │   │   └───theme
│       │   ├───plugins
│       │   │   └───nucleo
│       │   │       ├───css
│       │   │       └───fonts
│       │   └───scss
│       │       ...
│       │       └───react
│       │           ├───bootstrap
│       │           └───plugins
│       ├───components
│       │   ├───Footers
│       │   ├───Headers
│       │   ├───Navbars
│       │   └───Sidebar
│       ├───context
│       ├───layouts
│       ├───variables
│       └───views
│           └───pages
│               ├───admin
│               ├───capstone
│               ├───document
│               ├───project
│               └───users
└───src
    ├───controllers
    ├───middleware
    ├───models
    ├───routes
    └───seed
```

## Google Services

**Virtual Machine** [https://cloud.google.com/compute/docs/instances](https://cloud.google.com/compute/docs/instances)<br>
**Storage** _google-storage.json_
[Google Bucket](https://cloud.google.com/storage/docs/creating-buckets)<br>
**Youtube API** https://developers.google.com/apis-explorer<br>
**Vimeo API** https://developer.vimeo.com/<br>
_Updated 2020-06-29_
