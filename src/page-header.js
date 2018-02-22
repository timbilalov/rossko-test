import React from "react";

export default class PageHeader extends React.Component {
    showSearchResults() {
        const resultsBlock = document.getElementById("search-results");
        if (!resultsBlock) {
            return;
        }
        resultsBlock.style.display = "block";
    }

    hideSearchResults() {
        const resultsBlock = document.getElementById("search-results");
        if (!resultsBlock) {
            return;
        }
        resultsBlock.style.display = "none";
    }

    handleBlur() {
        setTimeout(this.hideSearchResults, 200);
    }

    render() {
        const context = this;
        const searchResult = (this.props.searchResult || []).map(function(elem) {
            return (
                <div className="page-header__s-res-item" key={ elem.date } onClick={ (date) => context.props.onSearchResClick(elem.date) }>
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
                            <button className="btn">Добавить</button>
                        </div>

                        <div className="page-header__search">
                            <input type="search" id="search-input" value={ this.props.searchValue } onChange={ (e) => this.props.onSearchChange(e) } placeholder="Событие, дата или участник" />

                            <div className="page-header__s-results event-popup" id="search-results" style={{ "visibility": (this.props.searchValue.trim() !== "" ? "" : "hidden") }}>
                                {
                                    (this.props.searchValue.trim() !== "" && searchResult.length > 0) &&
                                    searchResult
                                }
                                {
                                    (this.props.searchValue.trim() !== "" && searchResult.length <= 0) &&
                                    <span>Нет подходящих событий</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const searchInput = document.getElementById("search-input");
        searchInput.addEventListener("focus", this.showSearchResults);
        searchInput.addEventListener("blur", () => this.handleBlur());
    }
}