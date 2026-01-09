import { type MouseEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { Alert } from '@/components';
import { useIntl, FormattedMessage } from 'react-intl';
import axios from "axios";



const getLoginSchema = (intl: any) => Yup.object().shape({
  email: Yup.string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, intl.formatMessage({ id: 'AUTH.VALIDATION.INVALID_EMAIL' }))
    .required(intl.formatMessage({ id: 'AUTH.VALIDATION.EMAIL_REQUIRED' })),
  password: Yup.string()
    .min(8, intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORD_STRENGTH' }))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORD_STRENGTH' })
    )
    .required(intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORD_REQUIRED' })),
});

const initialValues = {
  email: 'demo@example.com',
  password: 'demo1234',
  remember: false
};


const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();
  const intl = useIntl();
  const loginSchema = getLoginSchema(intl);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,

    // onSubmit: async (values, { setStatus, setSubmitting }) => {
    //   setLoading(true);
    //   try {
    //     if (!login) {
    //       throw new Error('JWTProvider is required for this form.');
    //     }

    //     await login('demo@keenthemes.com', values.password);

    //     if (values.remember) {
    //       localStorage.setItem('email', "demo@keenthemes.com");
    //     } else {
    //       localStorage.removeItem('email');
    //     }

    //     navigate(from, { replace: true });
    //   } catch {
    //     setStatus('The login details are incorrect');
    //     setSubmitting(false);
    //   }
    //   setLoading(false);
    // }


    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!login) throw new Error('JWTProvider is required for login.');

        await login(values.email, values.password);

        if (values.remember) {
          localStorage.setItem("email", values.email);
        } else {
          localStorage.removeItem("email");
        }
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error("Login error", error);

        // let msg = error?.message || "Invalid email or password";

        // if (
        //   msg.toLowerCase().includes("token") ||
        //   msg.toLowerCase().includes("invalid") ||
        //   msg.toLowerCase().includes("not found")
        // ) {
        //   msg = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
        // }

        console.log(" LOGIN ERROR MESSAGE FROM BACKEND:", error?.response?.data?.message);
        console.log("LOGIN ERROR DATA:", error?.response?.data?.data);

        const msg = error?.response?.data?.message || error?.message || "Invalid email or password";
        console.log(" ERROR SHOWN TO USER:", msg);
        setStatus(msg);
        setSubmitting(false);
      }
      setLoading(false);
    }



  });

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleRemember = () => {
    formik.setFieldValue("remember", !formik.values.remember);
  };


  return (
    <div className="card max-w-[390px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            <FormattedMessage id="AUTH.LOGIN.TITLE" />
          </h3>
          <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">
              <FormattedMessage id="AUTH.LOGIN.NEED_ACCOUNT" />
            </span>
            <Link
              to={currentLayout?.name === 'auth-branded' ? '/auth/signup' : '/auth/classic/signup'}
              className="text-2sm link"
            >
              <FormattedMessage id="AUTH.LOGIN.SIGNUP" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* <a href="#" className="btn btn-light btn-sm justify-center">
            <img
              src={toAbsoluteUrl('/media/brand-logos/google.svg')}
              className="size-3.5 shrink-0"
            />
            Continue with Google
          </a> */}

          <button
            type="button"
            onClick={async () => {
              try {
                setLoading(true);
                if (!loginWithGoogle) throw new Error("Google login not found");
                const success = await loginWithGoogle();
                if (success) {
                  navigate(from, { replace: true });
                }
                // If success is false, user closed the popup - do nothing
              } catch (error: any) {
                console.error(error);
                alert(error.message || "Google Sign-In failed");
              } finally {
                setLoading(false);
              }
            }}
            className="btn btn-light btn-sm justify-center"
          >
            <img
              src={toAbsoluteUrl('/media/brand-logos/google.svg')}
              className="size-3.5 shrink-0"
            />
            <FormattedMessage id="AUTH.LOGIN.CONTINUE_WITH_GOOGLE" />
          </button>

        </div>

        <div className="flex items-center gap-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            <FormattedMessage id="AUTH.LOGIN.OR" />
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>



        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">
            <FormattedMessage id="AUTH.LOGIN.EMAIL" />
          </label>
          <label className="input">
            <input
              placeholder={intl.formatMessage({ id: 'AUTH.LOGIN.PLACEHOLDER_EMAIL' })}
              autoComplete="off"
              {...formik.getFieldProps('email')}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setStatus("");
              }}
              className={clsx('form-control', {
                'is-invalid': formik.touched.email && formik.errors.email
              })}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">
              <FormattedMessage id="AUTH.LOGIN.PASSWORD" />
            </label>
            <Link
              to={
                currentLayout?.name === 'auth-branded'
                  ? '/auth/reset-password'
                  : '/auth/classic/reset-password'
              }
              className="text-2sm link shrink-0"
            >
              <FormattedMessage id="AUTH.LOGIN.FORGOT_PASSWORD" />
            </Link>
          </div>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={intl.formatMessage({ id: 'AUTH.LOGIN.PLACEHOLDER_PASSWORD' })}
              autoComplete="off"
              {...formik.getFieldProps('password')}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setStatus("");
              }}
              className={clsx('form-control', {
                'is-invalid': formik.touched.password && formik.errors.password
              })}
            />
            <button type="button" className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        {/* <label className="checkbox-group">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            {...formik.getFieldProps('remember')}
          />
          <span className="checkbox-label">Remember me</span>
        </label> */}

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              className="checkbox checkbox-sm"
              checked={formik.values.remember}
              onChange={(e) => {
                formik.setFieldValue("remember", e.target.checked);
              }}
            />
            <span className="checkbox-label">
              <FormattedMessage id="AUTH.LOGIN.REMEMBER_ME" />
            </span>
          </label>
        </div>



        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting || !formik.isValid}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            intl.formatMessage({ id: 'AUTH.LOGIN.BUTTON' })
          )}
        </button>
      </form>
    </div>
  );
};

export { Login };
