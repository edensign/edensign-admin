import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};


function getStyles(name, personName, theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

export default function DependentDropdowns() {
	const [car, setCar] = useState({});
	const [years, setYears] = useState([]);
	const [makes, setMakes] = useState([]);
	const [models, setModels] = useState([]);

	useEffect(() => {
		axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year')
			.then(({ data }) => {
				setYears(data.menuItem.map((item) => item.value));
			});
	}, []);

	const getMakes = (year) => {
		setModels([]);
		setCar({ year, make: '', model: '' });
		axios.get(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
			.then(({ data }) => {
				setMakes(data.menuItem.map((item) => item.value));
			});
	};

	return (
		<Container maxWidth="md" style={{ marginTop: '35px' }}>
			<Autocomplete
				onChange={(_, year) => getMakes(year)}
				options={years}
				renderInput={(params) => (
					<TextField {...params} label="Year" variant="outlined" />
				)}
			/>

		</Container>
	);
}
