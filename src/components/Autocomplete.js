import React, { Component } from 'react'

export default class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentHint: 0,
            filtered: [],
            showHints: false,
            query: '',
            loading: false
        };
      }

    onChange = (e) => {
        let filtered = [];
        const query = e.currentTarget.value;

        if (query.length > 1) {
            this.setState({
                loading: true
            })
            this.getUsers().then(response => {
                filtered = response.filter(user => user.login.toLowerCase().indexOf(query.toLowerCase()) > -1)
                this.setState({
                    currentHint: 0,
                    filtered,
                    showHints: true,
                    query,
                    loading: false
                });
            })
        } else {
            this.setState({
                currentHint: 0,
                showHints: false,
                filtered,
                query
            })
        }
      };

      onClick = (e) => {
        this.setState({
            currentHint: 0,
          filtered: [],
          showHints: false,
          query: e.currentTarget.innerText
        });
      };

      onKeyDown = e => {
        const { currentHint, filtered } = this.state;
        if (e.keyCode === 13) {
          this.setState({
            currentHint: 0,
            showHints: false,
            query: filtered[currentHint-1].login
          });
        }
        else if (e.keyCode === 38) {
          if (currentHint === 0) {
            return;
          }
    
          this.setState({ currentHint: currentHint - 1 });
        }
        else if (e.keyCode === 40) {
            console.log(filtered)
            console.log(currentHint)
          if (currentHint === filtered.length) {
            return;
          }
    
          this.setState({ currentHint: currentHint + 1 });
        }
      };

    async getUsers() {
        const response = await fetch("https://api.github.com/users?since=1231&page=1&per_page=50");
        const json = await response.json();
        return json;
    }

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
              currentHint,
              filtered,
              showHints,
              query,
              loading
            }
          } = this;

        let suggestionsListComponent;
        if (loading) {
            suggestionsListComponent = (
                <div className="no-hints">
                    <em>Loading...</em>
                </div>
            )
        } else if (showHints && query) {
            if (filtered.length) {
                suggestionsListComponent = (
                <ul className="hints">
                    {filtered.map((hint, index) => {
                    return (
                        <li key={hint.login} onClick={onClick} className={currentHint-1 === index ? 'selected' : ''}>
                        {hint.login}
                        </li>
                    );
                    })}
                </ul>
                );
            } else {
                suggestionsListComponent = (
                <div className="no-hints">
                    <em>No suggestions!</em>
                </div>
                );
            }
        }
        return (
            <>
                <input type="text" onChange={onChange} onKeyDown={onKeyDown} value={query}/>
                {suggestionsListComponent}
            </>
        )
    }
}
