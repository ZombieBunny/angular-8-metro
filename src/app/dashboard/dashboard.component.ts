import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public showFiller = false;
  public baseUrl = "https://proserver.gometro.co.za/api/v1";

  public rails = [];
  public stops = [];
  public markers: {lat: number, lng: number, alpha: number, id: number}[] = [];
  public stopDetails = null;
  public updated = {
    routes_announcements: []
  };

  latitude = -33.92272;
  longitude = 18.42521;
  mapType = 'roadmap';
  // at: -33.92272, lon: 18.42521

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getRailRoutes();
  }

  public getRailRoutes(): void {
    this.http.get(`${this.baseUrl}/rail/routes`)
    .subscribe((data: any[]) => {
      console.log('rails', data);
      this.rails = data;
    });
  }

  public getStops(railId): void {
    this.http.get(`${this.baseUrl}/rail/routes/${railId}/stops`)
    .subscribe((data: any[]) => {
      console.log('stops', data);
      this.stops = data;
      this.markers = [];
      this.stops.forEach(element => this.addMarker(element));
    });
  }

  public addMarker(marker: any): void {
    this.markers.push({ lat: marker.lat, lng: marker.lon, alpha: 0.4, ...marker });
  }

  public selectMarker(marker): void {
    console.log('selected marker', marker);
    console.log(this.markers.filter(f => f.lng === marker.longitude && f.lat === marker.latitude)[0]);
    const stop = this.markers.filter(f => f.lng === marker.longitude && f.lat === marker.latitude)[0];
    this.getStopUpdates(stop.id);
    this.getLineUpdates(stop.id);
  }

  public getStopUpdates(stopId): void {
    this.http.get(`${this.baseUrl}/rail/stop/${stopId}`)
    .subscribe((data: any[]) => {
      console.log('getStopUpdates', data);
      this.stopDetails = data;
    });
  }

  public getLineUpdates(stopId): void {
    this.http.get(`${this.baseUrl}/rail/lineupdates/${stopId}`)
    .subscribe((data: any) => {
      console.log('getLineUpdates', data);
      this.updated = data;
    });
  }
}
