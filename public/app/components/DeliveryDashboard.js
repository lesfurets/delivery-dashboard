import React from 'react';
import Menu from './Menu';

export default class Application extends React.Component {
    render() {
        return <div>
            <Menu />
            <div id="content-wrapper" className="content-wrapper container-fluid">
                <div className="container-fluid row">
                    {this.props.children}
                </div>
            </div>
            <footer className="main-footer">
                <strong>Copyright rien du tout</strong>
            </footer>
        </div>;
    }
}
