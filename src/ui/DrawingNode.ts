
namespace Vgx {

    export interface DrawingNodeEntityVisibilityChangedEventArgs extends EventArgs {
        get originalSource(): DrawingNode;
        get hidden(): boolean;
    }

    export class DrawingNode {

        private _events: EventsManager;
        private _hidden: boolean;
        private _parentHidden: boolean;
        private _isExpanded: boolean;
        private _htmlElement: HTMLElement;
        private _htmlHeader: HTMLElement;
        private _htmlHeaderExpander: HTMLElement;
        private _htmlHeaderText: HTMLElement;
        private _htmlHeaderButtons: HTMLElement;
        private _htmlChildren: HTMLElement;
        private _entity: VgxEntity;
        private _children: DrawingNode[];
        private _parent: DrawingNode;

        public onEntityVisibilityStateChanged: EventSet<DrawingNode, DrawingNodeEntityVisibilityChangedEventArgs>;

        constructor() {

            this._events = new EventsManager(this);

            this._children = [];

            this._htmlElement = window.document.createElement("div");
            this._htmlElement.classList.add("drawing-node");

            this._htmlHeader = window.document.createElement("div");
            this._htmlHeader.classList.add("drawing-node-header");
            this._htmlElement.appendChild(this._htmlHeader);

            this._htmlHeaderExpander = window.document.createElement("div");
            this._htmlHeaderExpander.classList.add("expander");
            this._htmlHeaderExpander.title = "expand/collapse";
            this._htmlHeader.appendChild(this._htmlHeaderExpander);

            this._htmlHeaderText = window.document.createElement("div");
            this._htmlHeaderText.classList.add("text");
            this._htmlHeader.appendChild(this._htmlHeaderText);

            this._htmlHeaderButtons = window.document.createElement("div");
            this._htmlHeaderButtons.classList.add("buttons");
            this._htmlHeaderButtons.title = "show/hide";
            this._htmlHeader.appendChild(this._htmlHeaderButtons);

            this._htmlChildren = window.document.createElement("div");
            this._htmlChildren.classList.add("drawing-node-children");
            this._htmlElement.appendChild(this._htmlChildren);

            this._buildExpander();
            this._buildButtons();

            this._isExpanded = false;

            this.onEntityVisibilityStateChanged = new EventSet<DrawingNode, DrawingNodeEntityVisibilityChangedEventArgs>(this._events, "onEntityVisibilityStateChanged", this);
        }

        private _buildExpander() {

            const expandButton = window.document.createElement("i");
            expandButton.classList.add("expanded");
            expandButton.classList.add("fas");
            expandButton.classList.add("fa-chevron-down");
            expandButton.addEventListener("click", this._expandCollapseButtonClick.bind(this));
            this._htmlHeaderExpander.appendChild(expandButton);

            const collapseButton = window.document.createElement("i");
            collapseButton.classList.add("collapsed");
            collapseButton.classList.add("fas");
            collapseButton.classList.add("fa-chevron-right");
            collapseButton.addEventListener("click", this._expandCollapseButtonClick.bind(this));
            this._htmlHeaderExpander.appendChild(collapseButton);
        }

        private _buildButtons() {

            const visibleButton = window.document.createElement("i");
            visibleButton.classList.add("visible");
            visibleButton.classList.add("fas");
            visibleButton.classList.add("fa-eye");
            visibleButton.addEventListener("click", this._showHideButtonClick.bind(this));
            this._htmlHeaderButtons.appendChild(visibleButton);

            const hiddenButton = window.document.createElement("i");
            hiddenButton.classList.add("hidden");
            hiddenButton.classList.add("fas");
            hiddenButton.classList.add("fa-eye-slash");
            hiddenButton.addEventListener("click", this._showHideButtonClick.bind(this));
            this._htmlHeaderButtons.appendChild(hiddenButton);
        }

        private _loadEntity() {
            const typeEntry = EntityTypeManager.getByTypeConstructor(this._entity.constructor);
            if (this._entity.id) {
                this._htmlHeaderText.innerHTML = `<b>${this._entity.id}</b> [${typeEntry.key}]`;
            } else {
                this._htmlHeaderText.textContent = `[${typeEntry.key}]`;
            }
        }

        private _updateVisibilityVisualState() {
            if (this._hidden || this._parentHidden) {
                this._setVisualHidden();
            } else {
                this._setVisualVisible();
            }
        }

        private _toggleVisible() {
            if (!this._parentHidden) {
                this._hidden = !this._hidden;
                this._updateVisibilityVisualState();
                this._entity.visible = !this._hidden;
                this.onEntityVisibilityStateChanged.trigger({
                    originalSource: this,
                    hidden: this._hidden
                });
            }
        }

        private _setVisualHidden() {
            this._htmlHeaderButtons.classList.add("hidden");
        }

        private _setVisualVisible() {
            this._htmlHeaderButtons.classList.remove("hidden");
        }

        public _setParent(parentNode: DrawingNode) {
            if (this._parent) {
                this._parent.onEntityVisibilityStateChanged.remove(this._parentNodeEntityVisibilityStateChanged);
            }
            this._parent = parentNode;
            this._parent.onEntityVisibilityStateChanged.add(this._parentNodeEntityVisibilityStateChanged, this);
        }

        private _expandCollapseButtonClick(e: Event) {
            this._isExpanded = !this._isExpanded;
            if (this._isExpanded) {
                this._htmlChildren.style.display = "block";
            }
            else {
                this._htmlChildren.style.display = "none";
            }
        }

        private _showHideButtonClick(e: Event) {
            if (this._parentHidden) {
                return;
            }
            this._toggleVisible();
        }

        private _parentNodeEntityVisibilityStateChanged(s: DrawingNode, e: DrawingNodeEntityVisibilityChangedEventArgs) {
            this._parentHidden = e.hidden;
            this._updateVisibilityVisualState();
            if (!this._parentHidden) {
                e = {
                    originalSource: e.originalSource,
                    hidden: this._hidden
                }
            }
            this.onEntityVisibilityStateChanged.trigger(e);
        }

        public get htmlElement() { return this._htmlElement; }

        public get entity(): VgxEntity { return this._entity; }
        public set entity(v: VgxEntity) { 
            this._entity = v;
            this._loadEntity();
        }

        public get hidden(): boolean { return this._hidden; }
        public set hidden(v: boolean) { 
            if (this._hidden != !!v) {
                this._toggleVisible();
            }
        }

        public addChild(node: DrawingNode) {
            this._children.push(node);
            node._setParent(this);
            this._htmlChildren.appendChild(node.htmlElement);
            this._htmlHeaderExpander.style.visibility = "visible";
        }
    }
}