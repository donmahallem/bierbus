import * as L from "leaflet";
import * as stops from "./../assets/stops.json";
export class QuackGame {
    constructor(private parent: HTMLElement) {
    }

    public start(): void {
        const map = L.map(this.parent, { zoomControl: false }).setView([54.3364478, 10.1510508], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                + 'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
                + 'Imagery © <a href="https://www.mapbox.com/">Mapboxa</a>',
            maxZoom: 18,
            subdomains: ["a", "b", "c"],
        }).addTo(map);
        const latlngs: L.LatLngTuple[] = [];
        for (const st of stops.stops) {
            latlngs.push([st.latitude / 3600000, st.longitude / 3600000]);
        }
        const polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
        // zoom the map to the polyline
        map.fitBounds(polyline.getBounds());
    }

}
