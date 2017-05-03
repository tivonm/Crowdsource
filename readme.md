# Crowdsource

A nodejs app for sharing tasks.

### Prerequisites

RethinkDB
NodeJs

### Installing

Install RethinkDB

```
source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install rethinkdb
```
-https://rethinkdb.com/docs/install/ubuntu/

Install NodeJs

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```
-https://nodejs.org/en/download/package-manager/

## Deployment

Start RethinkDB using 'rethinkdb'
Start the node application using 'npm start'

## Built With

* [node.js](https://nodejs.org/en/) - The web framework used
* [RethinkDB](https://www.rethinkdb.com/) - Database

## License

This project is licensed under the MIT License