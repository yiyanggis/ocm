import {useStrict, observable, action} from 'mobx';


class ActiveEditableArea {
    constructor() {
        clear()
    }

    clear = action( 
        () => {
            this.topLevel = false;
            this.name = undefined;
            this.layerId = undefined;    
        })

    setName = action(
        name => this.name =name
    )

    setTopLevel = action(
        llv => this.topLevel = tlv
    )

    setLayerId = action(
        id => this.layerId
    )
}