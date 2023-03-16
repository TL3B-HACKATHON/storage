class Storage {
  constructor(Ipfs, OrbitDB) {
    this.Ipfs = Ipfs;
    this.OrbitDB = OrbitDB;
  }

  async create() {
    this.node = await this.Ipfs.create({
      preload: { enabled: false },
      repo: "./ipfs",
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] },
      },
    });
    this._init();
  }
  async _init() {
    this.orbitdb = await this.OrbitDB.createInstance(this.node);
    // this.docStore = await this.orbitdb.keyvalue("users");
    this.docStore = await this.orbitdb.open(
      "/orbitdb/zdpuAmF9VyeEjdtHUBdjBQA8Cmo2eLAfJuLBhvyfb7krRsqEZ/users"
    );
    // /orbitdb/zdpuAmF9VyeEjdtHUBdjBQA8Cmo2eLAfJuLBhvyfb7krRsqEZ/users
    // console.log(this.docStore);
    // console.log("this.docStore", this.docStore);

    await this.docStore.load();

    this.onready ? this.onready() : null;
  }

  async addNew({ id, data }) {
    return await this.docStore.put(id, data);
  }

  async getAll() {
    return await this.docStore.get("");
  }

  async getById(id) {
    return await this.docStore.get(id);
  }

  async deleteByid(id) {
    return await this.docStore.del(id);
  }
}

import * as Ipfs from "ipfs";
import OrbitDB from "orbit-db";
const Blockchain = new Storage(Ipfs, OrbitDB);

export default Blockchain;
