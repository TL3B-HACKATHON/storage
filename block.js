import { v4 as uuidv4 } from "uuid";

class Storage {
  constructor(Ipfs, OrbitDB, database) {
    this.Ipfs = Ipfs;
    this.OrbitDB = OrbitDB;
    this.database = database;
  }

  async create() {
    this.node = await this.Ipfs.create({
      preload: { enabled: false },
      repo: "./ipfs",
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],

        // Addresses: { Swarm: [
        //   "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star",
        //   "/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star",
        // ] },
      },
    });
    this._init();
  }
  async _init() {
    this.orbitdb = await this.OrbitDB.createInstance(this.node);
    this.docStore = await this.orbitdb.keyvalue(this.database);
    // this.docStore = await this.orbitdb.open(
    //   "/orbitdb/zdpuAyvWcC1VUeJEz2AbsCXzEshTy7xPn8H2NuEdftVzSADnN/users"
    // );
    // /orbitdb/zdpuAyvWcC1VUeJEz2AbsCXzEshTy7xPn8H2NuEdftVzSADnN/users
    // console.log("this.docStore", this.docStore);

    await this.docStore.load();

    this.onready ? this.onready() : null;
  }

  async addNew({ data }) {
    var id = uuidv4();
    var data = await this.docStore.put(id, JSON.stringify(data));
    return id;
  }

  async getById(id) {
    var data = await this.docStore.get(id);
    try {
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  async deleteByid(id) {
    return await this.docStore.del(id);
  }
}

import * as Ipfs from "ipfs";
import OrbitDB from "orbit-db";
//  /orbitdb/zdpuAyvWcC1VUeJEz2AbsCXzEshTy7xPn8H2NuEdftVzSADnN/users
const Blockchain = new Storage(
  Ipfs,
  OrbitDB,
  "/orbitdb/zdpuAyvWcC1VUeJEz2AbsCXzEshTy7xPn8H2NuEdftVzSADnN/users"
);

export default Blockchain;
