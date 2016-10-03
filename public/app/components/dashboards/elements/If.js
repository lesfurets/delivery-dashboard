import React from "react";
import TaskList from "./TaskList";

export default class Card extends React.Component {
    render() {
        return (
            <div>
                {this.props.condition ? this.props.children : ""}
            </div>
        );
    }
}