import React from "react";

export default class PageHeader extends React.Component {
    render() {
        return (
            <div className="page-header">
                <div className="l-container">
                    <div className="page-header__inner">
                        <div className="page-header__controls">
                            <button>Добавить</button>
                            <button>Обновить</button>
                        </div>

                        <div className="page-header__search">
                            <input type="search" placeholder="Событие, дата или участник" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}