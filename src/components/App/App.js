import React, { Component } from 'react';
import Nav from '../Nav/Nav';
import Container from '../Container/Container';
import Landing from '../Landing/Landing';
import CardDetails from '../CardDetails/CardDetails';
import { getMovie, getPlanets, getPeople, getVehicles } from '../Util/apiCalls';
import { Route, Link } from 'react-router-dom';
import './App.css';
import dualLightSabers from '../../images/dual-light-sabers.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      planets: [],
      people: [],
      vehicles: [],
      favorites: [],
      crawl: {},
      isLoading: true,
      theme: 'light'
    }
  }

  toggleFavorite = (card) => {
    const { favorites } = this.state;
    favorites.map(favorite => favorite.name).includes(card.name) ? this.removeFavorite(card) : this.addFavorite(card);
  }

  addFavorite = (card) => {
    const { favorites } = this.state;
    this.saveToStorage([...favorites, card]);
    this.setState({ favorites: [...favorites, card]});
  }

  removeFavorite = (card) => {
    const { favorites } = this.state;
    const filteredFavorites = favorites.filter(favorite => favorite.name !== card.name);
    this.setState({ favorites: filteredFavorites});
    this.saveToStorage(filteredFavorites);
  }

  saveToStorage = (favoritesArray) => {
    localStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  toggleTheme = () => {
    this.setState(({ theme }) => ({
      theme: theme === 'light' ? 'dark' : 'light'
    }))
  }

  componentDidMount() {
    let randomNumber = Math.floor((Math.random() * 7) + 1)
    getMovie(randomNumber)
      .then(data => this.setState({ crawl: { title: data.title, body: data.opening_crawl } }))
      .catch(error => console.log(error));
  
    getPlanets()
      .then(planets => this.setState({ planets, isLoading: false }))
      .catch(error => console.log(error))

    getPeople()
      .then(people => this.setState({ people }))
      .catch(error => console.log(error))

    getVehicles()
      .then(vehicles => this.setState({ vehicles }))
      .catch(error => console.log(error))

    if (localStorage.getItem('favorites')) {
      const favorites = JSON.parse(localStorage.getItem('favorites'));
      this.setState({ favorites });
    }
  }
    
  render() {
    const { planets, people, vehicles, favorites, crawl, theme } = this.state;
    const isDark = theme === 'dark' ? 'dark-theme' : '';
    return (
      <main className={`App-main ${isDark}`}>
        <header className="App-header">
          <Link to='/' className="link">
            { theme === 'light' && <h1>LightSide</h1> }
            { theme === 'dark'  && <h1 className="dark">DarkSide</h1> }
          </Link> 
          <img 
          className="light-sabers"
          src={dualLightSabers} 
          alt='Dueling Lightsabers theme picker' 
          onClick={this.toggleTheme}
          />
        </header>
        <Nav favorites={favorites} theme={theme} />
        <Route exact path='/' render={() => <Landing film={crawl}/> }/>
        <Route exact path='/planets' render={() => <Container data={planets} type="planets" toggleFavorite={this.toggleFavorite} favorites={favorites} theme={theme} />} />
        <Route exact path='/people' render={() => <Container data={people} type="people" toggleFavorite={this.toggleFavorite} favorites={favorites} theme={theme} />} />
        <Route exact path='/vehicles' render={() => <Container data={vehicles} type="vehicles" toggleFavorite={this.toggleFavorite} favorites={favorites} theme={theme} />} />
        <Route exact path='/favorites' render={() => <Container data={favorites} type="favorites" toggleFavorite={this.toggleFavorite} favorites={favorites} theme={theme} />} />
        <Route path='/planets/:name' render={({ match }) => {
            let targetPlanet = this.state.planets.find(planet => planet.name.replace(/\s/g, '') === match.params.name);
            return <CardDetails {...targetPlanet} type="planets" favorites={favorites} theme={theme} />
        }} />
        <Route path='/people/:name' render={({ match }) => {
            let targetPerson = this.state.people.find(person => person.name.replace(/\s/g, '') === match.params.name);
            return <CardDetails {...targetPerson} type="people" favorites={favorites} theme={theme} />
        }} />
        <Route path='/vehicles/:name' render={({ match }) => {
            let targetVehicle = this.state.vehicles.find(vehicle => vehicle.name.replace(/\s/g, '').replace("/", "") === match.params.name);
            return <CardDetails {...targetVehicle} type="vehicles" favorites={favorites} theme={theme} />
        }} />
        <Route path='/favorites/:name' render={({ match }) => {
            let targetFavorite = this.state.favorites.find(favorite => favorite.name.replace(/\s/g, '').replace("/", "") === match.params.name);
            return <CardDetails {...targetFavorite} type="favorites" favorites={favorites} theme={theme} />
        }} />
      </main>
    );
  }
}

export default App;