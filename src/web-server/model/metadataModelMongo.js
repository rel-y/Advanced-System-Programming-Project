const mongoose = require("mongoose");
const { Schema } = mongoose;

const NodeType = Object.freeze({
  FILE: "FILE",
  FOLDER: "FOLDER",
});

const PermissionType = Object.freeze({
  OWNER: 5,
  FILE_MANAGER: 4,
  WRITER: 3,
  COMMENTER: 2,
  VIEWER: 1,
  NON: 0,
});

const AbilityRequirement = Object.freeze({
  READ: PermissionType.VIEWER,
  COMMENT: PermissionType.COMMENTER,
  WRITE: PermissionType.WRITER,
  READ_PERMISSIONS: PermissionType.FILE_MANAGER,
  CHANGE_FILE_PERMISSIONS: PermissionType.FILE_MANAGER,
  CHANGE_REGULAR_USER_PERMISSIONS: PermissionType.FILE_MANAGER,
  CHANGE_ALL_USER_PERMISSIONS: PermissionType.OWNER,
  DELETE: PermissionType.OWNER,
});

// permission map: username -> permission level number
const metadataNodeSchema = new Schema(
  {
    _id: { type: String, required: true }, // keep your string ids (crypto hex), root is "0"
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(NodeType), required: true },

    parent: { type: String, default: null }, 
    uid: { type: String, default: null }, // owner id

    filePermissions: { type: Number, enum: Object.values(PermissionType), default: PermissionType.NON },

    userFilePermissions: {
      type: Map,
      of: { type: Number, enum: Object.values(PermissionType) },
      default: () => new Map(),
    },

    isInTrash: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    size: { type: Number, default: 0 },
  },
  { versionKey: false }
);

//indexes for speed
metadataNodeSchema.index({ parent: 1 });
metadataNodeSchema.index({ uid: 1 });

const MetadataNode = mongoose.model("MetadataNode", metadataNodeSchema);

module.exports = {
  MetadataNode,
  NodeType,
  PermissionType,
  AbilityRequirement,
};
