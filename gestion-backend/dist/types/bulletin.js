"use strict";
/**
 * Types pour la génération de bulletins scolaires
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = exports.ControlType = exports.BulletinStatus = void 0;
var BulletinStatus;
(function (BulletinStatus) {
    BulletinStatus["DRAFT"] = "DRAFT";
    BulletinStatus["GENERATED"] = "GENERATED";
    BulletinStatus["PUBLISHED"] = "PUBLISHED";
    BulletinStatus["ARCHIVED"] = "ARCHIVED";
    BulletinStatus["DELETED"] = "DELETED";
})(BulletinStatus || (exports.BulletinStatus = BulletinStatus = {}));
var ControlType;
(function (ControlType) {
    ControlType["CONTROLE_1"] = "CONTROLE_1";
    ControlType["CONTROLE_2"] = "CONTROLE_2";
    ControlType["CONTROLE_3"] = "CONTROLE_3";
    ControlType["CONTROLE_4"] = "CONTROLE_4";
})(ControlType || (exports.ControlType = ControlType = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["BULLETIN"] = "BULLETIN";
    DocumentType["RELEVE"] = "RELEVE";
    DocumentType["ATTESTATION_NIVEAU"] = "ATTESTATION_NIVEAU";
    DocumentType["ATTESTATION_FIN_ETUDES"] = "ATTESTATION_FIN_ETUDES";
    DocumentType["CERTIFICAT_SCOLARITE"] = "CERTIFICAT_SCOLARITE";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
//# sourceMappingURL=bulletin.js.map