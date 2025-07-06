import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';
import ionIconPath from '../assets/marker.png';

const Map = ({ cordinates, data, height = "500px" }) => {

    const customIcon = L.icon({
        iconUrl: ionIconPath,
        iconSize: [25, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
    })

    return <>
        <Box>
            <Typography variant="h6">{data?.name}</Typography>
        </Box>
        <MapContainer 
          center={[24.860966, 66.990501]} 
          zoom={13} 
          style={{ 
            height: height, 
            width: "100%",
            borderTopLeftRadius: '18px',
            borderTopRightRadius: '18px',
            overflow: 'hidden'
          }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {data.length > 0 ?
                data.map((item) => {
                    return (
                        item && !isNaN(item.longitude) && !isNaN(item.latitude) ? (
                            <Marker
                                key={item.id}
                                position={[item.longitude, item.latitude]}
                            />
                        ) : null
                    );
                }) :
                <Marker
                    position={data && !isNaN(data.longitude) && !isNaN(data.latitude)
                        ? [data.longitude, data.latitude]
                        : [24.860966, 66.990501]}
                    icon={customIcon}
                >
                </Marker>
            }
        </MapContainer >
    </>
}
export default Map;
