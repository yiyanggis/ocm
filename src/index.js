import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainMap from './Map'
import MyNavbar from './nav'



ReactDOM.render(
	<div>
		<div className="navBar">
			<MyNavbar/>
		</div>
		<div >
			<MainMap/>
		</div>
	</div>,
  document.getElementById('root')
);