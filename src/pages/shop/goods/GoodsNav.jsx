import "./nav.css";
import "bootstrap/dist/css/bootstrap.min.css";

function GoodsNav(){
    return (
        <>
           <header id="home" class="welcome-hero">
                <div class="top-area">
                    <div class="header-area">
                        <nav class="navbar navbar-default bootsnav  navbar-sticky navbar-scrollspy"  data-minus-value-desktop="70" data-minus-value-mobile="55" data-speed="1000">
                            <div class="container">            
                                <div class="navbar-header">
                                    <a class="navbar-brand" href="index.html">
                                        <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="logo_white"/>
                                    </a>
                                </div>

                                <div class="collapse navbar-collapse menu-ui-design" id="navbar-menu">
                                    {/* #axios 필요 */}
                                    <ul class="nav navbar-nav navbar-center" data-in="fadeInDown" data-out="fadeOutUp">
                                        <li class=" scroll active"><a href="#">분류1</a></li>
                                        <li class="scroll"><a href="#">분류2</a></li>
                                        <li class="scroll"><a href="#">분류3</a></li>
                                        <li class="scroll"><a href="#">분류4</a></li>
                                    </ul>
                                </div>

                                <div class="attr-nav">
                                    <ul>
                                        <li class="search">
                                            <a href="#"><span class="lnr lnr-magnifier"></span></a>
                                        </li>
                                        <li class="nav-setting">
                                            <a href="#"><span class="lnr lnr-cog"></span></a>
                                        </li>
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle"><span class="lnr lnr-cart"></span></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="top-search">
                                <div class="container">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                                        <input type="text" class="form-control" placeholder="Search"/>
                                        <span class="input-group-addon close-search"><i class="fa fa-times"></i></span>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

export default GoodsNav;