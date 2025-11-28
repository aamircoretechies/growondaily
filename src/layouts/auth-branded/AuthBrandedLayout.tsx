// import { Link, Outlet } from 'react-router-dom';
// import { Fragment } from 'react';
// import { toAbsoluteUrl } from '@/utils';
// import useBodyClasses from '@/hooks/useBodyClasses';
// import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';

// const Layout = () => {
//   // Applying body classes to manage the background color in dark mode
//   useBodyClasses('dark:bg-coal-500');

//   return (
//     <Fragment>
     

//       <div className="grid bg-beige dark:bg-coal-500 lg:grid-cols-1 grow">
     
//         <div className="flex flex-col justify-center items-center p-8 lg:p-10 order-1 lg:order-2">
//         <Link to="/">
//               <img
//                 src={toAbsoluteUrl('/media/app/default-logo.svg')}
//                 className="h-[40px] max-w-none mb-8"
//                 alt=""
//               />
//             </Link>
//           <Outlet />
//         </div>

       
//       </div>
//     </Fragment>
//   );
// };

// // AuthBrandedLayout component that wraps the Layout component with AuthBrandedLayoutProvider
// const AuthBrandedLayout = () => (
//   <AuthBrandedLayoutProvider>
//     <Layout />
//   </AuthBrandedLayoutProvider>
// );

// export { AuthBrandedLayout };
















import { Link, Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';
import useBodyClasses from '@/hooks/useBodyClasses';
import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';

const Layout = () => {
  // Applying body classes to manage the background color in dark mode
  useBodyClasses('dark:bg-coal-500');

  return (
    <Fragment>
     

      <div className="grid bg-beige dark:bg-coal-500 lg:grid-cols-1 w-full" style={{ minHeight: '100vh', height: 'auto' }}>
     
        <div className="flex flex-col justify-center items-center p-8 lg:p-10 order-1 lg:order-2 w-full" style={{ minHeight: '100vh', height: 'auto' }}>
        <Link to="/">
              <img
                src={toAbsoluteUrl('/media/app/default-logo.svg')}
                className="h-[40px] max-w-none mb-8"
                alt=""
              />
            </Link>
          <Outlet />
        </div>

       
      </div>
    </Fragment>
  );
};

// AuthBrandedLayout component that wraps the Layout component with AuthBrandedLayoutProvider
const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);

export { AuthBrandedLayout };

