import {useStrict, observable, action} from 'mobx';

import ClimbDetailView from '../sidebar/ClimbDetailView';

const StateMachine = require('javascript-state-machine');


useStrict(true);

export const fsm = new StateMachine({
    init: 'init',
    transitions: [
      { name: 'show_detail_on_sidebar', from: 'init',            to: 'sidebar_visible'},
      { name: 'show_detail_on_sidebar', from: 'sidebar_visible', to: 'sidebar_visible'},
      { name: 'hide_sidebar',           from: 'sidebar_visible', to: 'init'},      
    ],
    methods: {
        onShowAddBoundary: function(target) { 
            console.log('show_add_boundary');
        },
        onShowDetailOnSidebar:   function(fsmEvent, userEvent) {
            console.log('onShowDetailSidebar', fsmEvent, userEvent);
            uiState.update('sidebarDetailView', userEvent);
        },
        onHideSidebar: function(fsmEvent, userEvent) {
            console.log('onHideDetailSidebar', fsmEvent);
            uiState.hide('sidebarDetailView', userEvent);
        }
    }
  });


export class UIEvent {
    constructor(opts) {
        const _opts = opts || {VIEW: undefined, visible: false, props: undefined};
        this.VIEW = _opts.VIEW;
        this.visible = _opts.visible || false;
        this.props = _opts.props || {};
    }
}  

class UIState {
    constructor() {
        this.sidebarDetailView = observable(new UIEvent({VIEW: ClimbDetailView}));
    }

    update = action((name, event) => {
        console.log('[UIState.update() before', this[name].get(), event);
        this[name].set(event);
        console.log(this[name]);
        console.log('[UIState.update() after]', this[name].get());
    })

    hide = action((name) => {
        console.log("Hiding ", name);
        const e = Object.assign({}, this[name].get());
        e.visible = false;
        this[name].set(e);
    })
}

export const uiState = new UIState();
window.uiState = uiState;
window.fsm = fsm;