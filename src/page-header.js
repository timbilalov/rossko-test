import React from "react";

export default class PageHeader extends React.Component {
    render() {
        const searchResult = (this.props.searchResult || []).map(function(elem) {
            return (
                <div className="page-header__s-res-item" key={ elem.date }>
                    <div className="page-header__s-res-name">{ elem.name }</div>
                    <div className="page-header__s-res-date">{ elem.date }</div>
                </div>
            )
        });

        return (
            <div className="page-header">
                <div className="l-container">
                    <div className="page-header__inner">
                        <div className="page-header__controls">
                            <button>Добавить</button>
                            <button>Обновить</button>
                        </div>

                        <div className="page-header__search">
                            <input type="search" value={ this.props.searchValue } onChange={ (e) => this.props.onSearchChange(e) } placeholder="Событие, дата или участник" />

                            <div className="page-header__s-results event-popup">
                                { searchResult }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}