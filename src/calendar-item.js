import React from "react";

export default class CalendarItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const date = this.props.date;
        const classNameModifier = this.props.classNameModifier || "";
        return (
            <div className={ "calendar-item " + classNameModifier }>
                <div className="calendar-item__inner">
                    <div className="calendar-item__date">
                        { date }
                    </div>

                    <div className="calendar-item__text">
                    </div>
                </div>
            </div>
        );
    }
}