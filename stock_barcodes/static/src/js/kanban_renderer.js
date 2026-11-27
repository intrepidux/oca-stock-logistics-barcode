/* Copyright 2022 Tecnativa - Alexandre D. Díaz
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl). */
odoo.define("stock_barcodes.KanbanRenderer", function (require) {
    "use strict";

    const BasicController = require("web.BasicController");
    const KanbanRenderer = require("web.KanbanRenderer");
    const BarcodesModelsMixin = require("stock_barcodes.BarcodesModelsMixin");
    // Ensure BasicController is patched before delegating key events from kanban cards.
    require("stock_barcodes.BasicController");

    KanbanRenderer.include(BarcodesModelsMixin);
    KanbanRenderer.include({
        /**
         * @override
         */
        init: function () {
            this._super.apply(this, arguments);
            this._is_valid_barcode_model = this._isAllowedBarcodeModel(
                this.state.model
            );
            if (this._is_valid_barcode_model) {
                // Controller base is used when the renderer its initialized by a field
                this._controller_base = this.findAncestor((parent) => {
                    return parent instanceof BasicController;
                });
            }
        },

        /**
         * Avoid intercept events in valid barcodes models.
         * This is necessary to get the event in the controller.
         *
         * @override
         */
        _onRecordKeyDown: function (ev) {
            if (this._is_valid_barcode_model && this._controller_base) {
                const handler = this._controller_base._onDocumentKeyDown;
                if (handler) {
                    ev.stopPropagation();
                    handler.call(this._controller_base, ev);
                    return;
                }
            }
            this._super.apply(this, arguments);
        },
    });
});
