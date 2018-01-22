import React from 'react'
import Input from '../../components/Input'
import Aux from '../../components/Aux'
import { search } from '../../utils/Search'
import './search.css'

class Search extends React.Component {
  state = {
    query: '',
    isSearching: false,
    result: null,
    error: null
  }

  onChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    })
  }

  onSubmit = async e => {
    e.preventDefault()

    this.setState({
      isSearching: true
    })

    try {
      const age = await search(this.state.query)

      this.setState({
        isSearching: false,
        query: '',
        result: `${this.state.query} came out ${age}.`
      })
    } catch (err) {
      this.setState({
        isSearching: false,
        error: `Sorry, I am unable to find the age for ${
          this.state.query
        }. Error: ${err.toString()}`
      })
    }
  }

  resetPage = () => {
    this.setState({
      query: '',
      isSearching: false,
      result: null,
      error: null
    })
  }

  renderSearch = () => {
    return (
      <Aux>
        <h1>How old is something in Brennen Years?</h1>
        <form onSubmit={this.onSubmit}>
          <Input
            name="query"
            value={this.state.query}
            placeholder="What would you like to search? eg. The Matrix"
            onChange={this.onChange}
          />
        </form>
      </Aux>
    )
  }

  renderLoading = () => {
    return <h1>LOADING</h1>
  }

  renderResult = () => {
    return (
      <Aux>
        <h1>Result: {this.state.result}</h1>

        <a href="javascript:;" onClick={this.resetPage}>
          Another One
        </a>
      </Aux>
    )
  }

  renderError = () => {
    return (
      <Aux>
        <h1>{this.state.error}</h1>

        <a href="javascript:;" onClick={this.resetPage}>
          Another One
        </a>
      </Aux>
    )
  }

  render() {
    const { isSearching, result, error } = this.state

    const search =
      !isSearching && !result && !error ? this.renderSearch() : null
    const loading = isSearching ? this.renderLoading() : null
    const results = result ? this.renderResult() : null
    const errors = error ? this.renderError() : null

    return (
      <div className="search">
        {search}
        {loading}
        {results}
        {errors}
      </div>
    )
  }
}

export default Search
