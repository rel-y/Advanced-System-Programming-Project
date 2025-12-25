const crypto = require("crypto");//yooo crypto :)

const idLength = 32; //length of the id in hex characters

const NodeType = Object.freeze({
  FILE: "FILE",
  FOLDER: "FOLDER",
});

class FileNode {
  constructor(name, type, parent = null, uid = null) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.uid = uid; // owner user id
  }
}

class MetadataNode {
  constructor() {
    this.map = new Map(); // id -> FileNode
    this.childrenByParent = new Map(); // parentId -> Set(childId)

    // root
    const root = new FileNode("/", NodeType.FOLDER, null, null);
    this.map.set(0, root); //root folder with id 0
    this.childrenByParent.set(0, new Set()); // root children set
  }

  getFileNode(id) 
  {
    if(!this.map.has(id)) {
        throw new Error(`File/Folder with id ${id} does not exist`);
    }
    return this.map.get(id);
  }

  listChildIds(parentId) {
    return new Set(this.childrenByParent.get(parentId) || []);
  }

  listChildren(parentId) {
    const ids = this.childrenByParent.get(parentId);
    if (!ids) return [];
    return [...ids].map((id) => ({ id, node: this.map.get(id) })).filter(x => x.node);
  }

  addFileNode(name, type = NodeType.FILE, parent = 0, uid = null) {
    let id;
    do {
        id = crypto.randomBytes(idLength).toString("hex");
    } while (this.map.has(id));
    const parentNode = this.map.get(parent);
    if (!parentNode) {
      throw new Error(`Parent node with id ${parent} does not exist.`);
    }
    if (parentNode.type !== NodeType.FOLDER) {
      throw new Error(`Parent node with id ${parent} is not a folder.`);
    }
    if (type !== NodeType.FILE && type !== NodeType.FOLDER) {
      throw new Error(`Invalid node type: ${type}.`);
    }

    const node = new FileNode(name, type, parent, uid);
    this.map.set(id, node);

    // register child under parent
    if (!this.childrenByParent.has(parent)) {
      this.childrenByParent.set(parent, new Set());
    }
    this.childrenByParent.get(parent).add(id);

    // if it's a folder, create an empty children set for it
    if (type === NodeType.FOLDER && !this.childrenByParent.has(id)) {
      this.childrenByParent.set(id, new Set());
    }
    return id;
  }

  deleteFileNode(id) {
    if (id === 0) throw new Error("Cannot delete root.");
    const node = this.map.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} does not exist.`);
    }

    // folder must be empty
    const kids = this.childrenByParent.get(id);
    if (node.type === NodeType.FOLDER && kids && kids.size > 0) {
      throw new Error(`Cannot delete folder with id ${id} because it is not empty.`);
    }

    // remove from parent's children set
    if (node.parent !== null && node.parent !== undefined) {
      this.childrenByParent.get(node.parent)?.delete(id);
    }

    // cleanup bookkeeping
    this.childrenByParent.delete(id);
    this.map.delete(id);
  }

  getAllBaseNodes() {
    // "base" = children of root
    const ids = this.childrenByParent.get(0);
    if (!ids) return [];
    const out = [];
    for (const id of ids) {
      const node = this.map.get(id);
      if (node) out.push({ id, name: node.name, type: node.type, uid: node.uid });
    }
    return out;
  }
  renameFileNode(id, newName) {
    if (typeof newName !== "string" || newName.trim() === "") {
        throw new Error("Invalid file name");
    }

    const node = this.map.get(id);
    if (!node) {
        throw new Error(`File/Folder with id ${id} does not exist`);
    }

    node.name = newName;
  }
  searchFileIdByName(query) {
    const results = [];
    for (const [id, node] of this.map.entries()) {
        if (node.name.includes(query)) {
            results.push(id);
        }
    }
    return results;
  }
  getFullPath(id) {
    const node = this.map.get(id);
    if (!node) {
        throw new Error(`File/Folder with id ${id} does not exist`);
    }

    let path = '';
    let currentId = id;

    while (currentId !== null && currentId !== undefined) {
        const currentNode = this.map.get(currentId);
        if (!currentNode) break;
        path = `/${currentNode.name}${path}`;
        currentId = currentNode.parent;
    }

    return path || '/';
  }
}

const singletonMetadataModel = new MetadataNode();
module.exports = { singletonMetadataModel, NodeType };
