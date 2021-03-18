import { Dropdown } from 'react-bootstrap';
import React from 'react';
import Autosuggest from 'react-autosuggest';
// import theme from './theme.css'
// import DropdownItem from 'react-bootstrap/esm/DropdownItem';

export default class Autocomplete extends React.Component {
    constructor(props) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            suggestions: [],
            names : this.props.names,
        };
    }
    
    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        // console.log(this.props)
        // console.log(this.state.names)
        return inputLength === 0 ? [] : this.state.names.filter(p_name =>
            p_name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
        
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        // console.log(this.getSuggestions(value))
        this.setState({
            suggestions: this.getSuggestions(value),
            
        });
        this.props.onAutocomplete(this.getSuggestions(value));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue = suggestion => suggestion;

    renderSuggestion = suggestion => (
        <span className={'suggestion-content '}>
            <span className="name">
                {suggestion}
            {/* {
                // parts.map((part, index) => {
                // const className = part.highlight ? 'highlight' : null;
    
                return (
                    <span className={className} key={index}>{part.text}</span>
                );
                })
            } */}
            </span>
        </span>
      );
    render(){
        // console.log(this.props)
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type a name',
            value,
            onChange: this.onChange
        }

        // Finally, render it!
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                
                
            />
        );
    }
}