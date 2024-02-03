import { Link } from "react-router-dom";
import { API_URL } from "../http";
import React, { useContext } from "react";
import { Context } from "../index";

const Navbar = () => {
    const { store } = useContext(Context);

    return (
        <div className="container">
            <nav className="py-3 mb-3 border-bottom">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div>
                        <Link to={`/`}>
                            <img
                                src="logo.png"
                                alt="logo"
                                style={{ maxWidth: '100%', height: 'auto', width: '100px' }}
                                className="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-body-emphasis text-decoration-none dropdown-toggle"
                            />
                        </Link>
                    </div>

                    <div className="d-flex align-items-center">
                        <form className="me-3" role="search">
                            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" style={{ maxWidth: '150px' }} />
                        </form>
                        <div className="me-2">{store.user.email}</div>
                        <div className="flex-shrink-0 dropdown">
                            <Link to={`/`} className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                {store.user.profilePictureId ? (
                                    <img src={`${API_URL}/image/${store.user.profilePictureId}`} alt="mdo" width="35" height="35" className="rounded-circle" />
                                ) : (
                                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="mdo" width="35" height="35" className="rounded-circle" />
                                )}
                            </Link>
                            <ul className="dropdown-menu text-small shadow">
                                <li><Link to={`/profile`} className="dropdown-item">Profile</Link></li>
                                <li><Link to={`/settings`} className="dropdown-item">Settings</Link></li>
                                <li><a href="/admin" className="dropdown-item" style={{ color: 'red' }}>Admin panel</a></li>
                                <li>
                                    <hr className="dropdown-divider"></hr>
                                </li>
                                <li><a className="dropdown-item" onClick={() => store.logout()}>Sign out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
