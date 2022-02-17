import React, { useState, useEffect } from "react";

class New extends React.Component {


    state = { count: 0, intervalId: 0 };



    componentDidMount() {
        const newIntervalId = setInterval(() => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    count: prevState.count + 1,
                };
            });
        }, 1000);
      
        this.setState(prevState => {
            return {
                ...prevState,
                intervalId: newIntervalId,
            };
        });
    }

    componentWillUnmount(){
        clearInterval(intervalId);
    }


    render() {
        return (
            <h1>The component has been rendered for {this.state.count} seconds</h1>
        );
    }


}
export default New;
            //Run any function or setState here
