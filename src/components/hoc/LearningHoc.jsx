import React from "react";

const updatedComponent = (WrappedComponent) => {
    class NewComponent extends React.Component {

        

        render() {
            return <WrappedComponent />
        }
    }

    return NewComponent;
}

export default updatedComponent;
