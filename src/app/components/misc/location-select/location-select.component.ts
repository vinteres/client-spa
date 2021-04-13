import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { LocationsService } from 'src/app/services/locations.service'

@Component({
  selector: 'location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.sass']
})
export class LocationSelectComponent implements OnInit {

  @Input() location: any = { name: '' }
  @Output() locationChanged: EventEmitter<any> = new EventEmitter()

  loading: boolean
  loadingCities: boolean
  showCountries: boolean
  selectedCountry

  selectedInterestCategory: any
  interestSearchTimer: any
  matches: any
  showHighlight: boolean

  cities: any = []

  constructor(private locationService: LocationsService) { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    const target = event.target
    const classesOf = (ele) => ('string' === typeof ele.className) ? ele.className.split(' ') : []
    const hasClass = (cls, classes) => {
      for (const clsI of classes) {
        if (cls === clsI) { return true }
      }

      return false
    }
    const hasClassAncestor = (ele) => {
      const targetClass = 'locations-dropdown'
      let targetEle = ele
      while (targetEle) {
        if (hasClass(targetClass, classesOf(targetEle))) { return true }

        targetEle = targetEle.parentNode
      }

      return false
    }

    if (!hasClassAncestor(target)) {
      this.showHighlight = false
    }
  }

  interestKeyUp(event) {
    clearTimeout(this.interestSearchTimer)
    this.interestSearchTimer = setTimeout(() => {
      this.startLoading()

      const search = event.target.value
      this.showCountries = false
      this.selectedCountry = null

      if (search.length) {
        this.locationService.search(search)
          .subscribe(locations => {
            this.matches = locations
            this.loading = false
          })
        this.showHighlight = true
      } else {
        this.matches = []
        this.loading = false
      }
    }, 200)
  }

  interestKeyDown() {
    clearTimeout(this.interestSearchTimer)
  }

  select(location) {
    this.locationChanged.emit(location)
    this.matches = []
  }

  selectCity({ id, name }: { id: string, name: string}) {
    this.locationChanged.emit({
      id,
      name: null,
      fullName: name
    })
    this.matches = []
    this.selectedCountry = null
    this.showHighlight = true
  }

  inputFocus() {
    this.showHighlight = true
  }

  showCitiesOf(country) {
    this.showCountries = false
    this.selectedCountry = country
    this.loadingCities = true

    this.locationService.getCities(country.id)
      .subscribe(cities => {
        this.cities = cities
        this.loadingCities = false
      })
  }

  private startLoading() {
    this.loading = true
    this.matches = []
  }
}
