
namespace Vgx {

    export class DrawingStructureView {

        private _htmlElement: HTMLElement;
        private _htmlContent: HTMLElement;
        private _drawing: Drawing;
        //private _drawingDirtyEventHandler: any;

        constructor() {
            this._htmlElement = window.document.createElement("div");
            this._htmlElement.classList.add("drawing-structure-view");

            this._htmlContent = window.document.createElement("div");
            this._htmlContent.classList.add("drawing-structure-content");
            this._htmlElement.appendChild(this._htmlContent);

            //this._drawingDirtyEventHandler = this._onDrawingDirty.bind(this);
        }

        // private _onDrawingDirty() {
        //     this._loadDrawingStructure();
        // }

        private _onDrawingChildrenChanged(s: Drawing, e: CollectionChangedArgs<VgxEntity>) {
            this._loadDrawingStructure();
        }

        private _loadEntityNode(entity: VgxEntity) {

            const node = new DrawingNode();
            node.entity = entity;

            if ("children" in entity) {
                const children = (entity as any).children as VgxEntityCollection;
                for (const childEntity of children) {
                    const childNode = this._loadEntityNode(childEntity);
                    node.addChild(childNode);
                }
            }

            return node;
        }

        private _loadDrawingStructure() {
            for (const entity of this._drawing.getChildren()) {
                const entityNode = this._loadEntityNode(entity);
                this._htmlContent.appendChild(entityNode.htmlElement);
            }
        }


        public get htmlElement() { return this._htmlElement; }
        public get drawing() { return this._drawing; }

        public attachToDrawing(drawing: Drawing) {
            if (this._drawing) {
                //this._drawing.unregisterDirtyEventHandler(this._drawingDirtyEventHandler);
                this._drawing.onChildrenChanged.remove(this._onDrawingChildrenChanged);
            }
            this._htmlContent.innerHTML = "";
            this._drawing = drawing;
            //this._drawing.registerDirtyEventHandler(this._drawingDirtyEventHandler);
            this._drawing.onChildrenChanged.add(this._onDrawingChildrenChanged, this);
            this._loadDrawingStructure();
        }
    }
}