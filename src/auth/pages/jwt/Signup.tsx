import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '../../useAuthContext';
import { toAbsoluteUrl } from '@/utils';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { toast } from "sonner";
import { useIntl, FormattedMessage } from 'react-intl';

const initialValues = {
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false
};

const getSignupSchema = (intl: any) => Yup.object().shape({
  email: Yup.string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, intl.formatMessage({ id: 'AUTH.VALIDATION.INVALID_EMAIL' }))
    .email(intl.formatMessage({ id: 'AUTH.VALIDATION.INVALID_EMAIL' }))
    .required(intl.formatMessage({ id: 'AUTH.VALIDATION.EMAIL_REQUIRED' })),

  // email: Yup.string()
  //   .email('Please enter a valid email address.')
  //   .test("valid-domain", "Please enter a valid email address", (value) => {
  //     if (!value) return false;

  //     const allowedDomains = [
  //       "gmail.com",
  //       "yahoo.com",
  //       "yahoo.in",
  //       "yahoo.co.in",
  //       "outlook.com",
  //       "hotmail.com",
  //       "live.com",
  //       "msn.com",
  //       "icloud.com",
  //       "me.com",
  //       "mac.com",
  //       "rediffmail.com",
  //       "rediff.com",
  //       "mail.ru",
  //       "proton.me",
  //       "zoho.com",
  //       "fastmail.com",
  //       "mycompany.com",
  //       "business.org",
  //       "mywebsite.net",
  //       "startup.io",
  //       "school.edu",
  //       "company.co.in"
  //     ];

  //     // extract domain from email
  //     const domain = value.split("@")[1]?.toLowerCase();

  //     // allow only if matches allowed domain list
  //     return allowedDomains.includes(domain);
  //   })
  //   .required('Email is required'),



  password: Yup.string()
    .min(8, intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORD_STRENGTH' }))
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORD_STRENGTH' }))
    .required(intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORD_REQUIRED' })),
  changepassword: Yup.string()
    .required(intl.formatMessage({ id: 'AUTH.VALIDATION.CONFIRM_PASSWORD_REQUIRED' }))
    .oneOf([Yup.ref('password')], intl.formatMessage({ id: 'AUTH.VALIDATION.PASSWORDS_MUST_MATCH' })),
  acceptTerms: Yup.bool().oneOf([true], intl.formatMessage({ id: 'AUTH.VALIDATION.ACCEPT_TERMS' }))
});



const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();
  const intl = useIntl();
  const signupSchema = getSignupSchema(intl);


  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,

    // onSubmit: async (values, { setStatus, setSubmitting }) => {
    //   setLoading(true);
    //   try {
    //     if (!register) throw new Error('JWTProvider is required for this form.');
    //     const response = await register(values.email, values.password, values.changepassword);
    //     if (response?.success) {
    //       navigate('/auth/login', { replace: true });
    //     }
    //   } catch (error: any) {
    //     console.error(error);
    //     setStatus(error.message || 'The sign up details are incorrect');
    //     setSubmitting(false);
    //     setLoading(false);
    //   }
    // }

    // onSubmit: async (values, { setStatus, setSubmitting }) => {
    //   setLoading(true);
    //   try {
    //     if (!register) throw new Error('JWTProvider is required for this form.');

    //     const response = await register(values.email, values.password, values.changepassword);

    //     if (response?.success) {
    //       toast.success("Registered successfully!");
    //       navigate('/auth/login', { replace: true });
    //       return;
    //     } else {
    //       setStatus("please enter valid Email or password");
    //     }
    //   } catch (error: any) {
    //     console.error(error);

    //     let message = error?.message || "Registration failed, please try again";

    //     if (
    //       message.toLowerCase().includes("invalid") ||
    //       message.toLowerCase().includes("exists")
    //     ) {
    //       message = "Please enter valid details";
    //     }

    //     setStatus(message);
    //   } finally {
    //     setSubmitting(false); 
    //     setLoading(false); 
    //   }
    // }


    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        if (!register) throw new Error('JWTProvider is required for this form.');

        const response = await register(
          values.email.toLowerCase(),
          values.password,
          values.changepassword
        );

        console.log("REGISTER RESPONSE:", response);

        const backendStatus = response?.data?.status;
        const backendMessage = response?.data?.message || "";

        // SUCCESS → status 1 hua karega
        if (backendStatus === 1) {
          toast.success(intl.formatMessage({ id: 'COMMON.SUCCESS' }));
          navigate('/auth/login', { replace: true });
          return;
        }

        // EMAIL EXISTS
        if (backendMessage.toLowerCase().includes("exists")) {
          setStatus("This email is already registered.");
          return;
        }

        setStatus(backendMessage || "Registration failed");

      } catch (error: any) {
        console.error("REGISTER ERROR:", error);

        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Registration failed";

        if (msg.toLowerCase().includes("exists")) {
          setStatus("This email is already registered.");
          return;
        }

        setStatus(msg);

      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }


  });


  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            <FormattedMessage id="AUTH.SIGNUP.TITLE" />
          </h3>
          <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">
              <FormattedMessage id="AUTH.SIGNUP.ALREADY_HAVE_ACCOUNT" />
            </span>
            <Link
              to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
              className="text-2sm link"
            >
              <FormattedMessage id="AUTH.SIGNUP.SIGNIN" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* <a href="#" className="btn btn-light btn-sm justify-center">
            <img
              src={toAbsoluteUrl('/media/brand-logos/google.svg')}
              className="size-3.5 shrink-0"
            />
            Use Google
          </a> */}

          <button
            type="button"
            onClick={async () => {
              try {
                setLoading(true);
                if (!loginWithGoogle) throw new Error("Google login not found");
                const success = await loginWithGoogle();
                if (success) {
                  window.location.href = from;
                }
                // If success is false, user closed the popup - do nothing
              } catch (error: any) {
                console.error(error);
                alert(error.message || "Google Sign-Up failed");
              } finally {
                setLoading(false);
              }
            }}
            className="btn btn-light btn-sm justify-center"
          >
            <img src={toAbsoluteUrl('/media/brand-logos/google.svg')} className="size-3.5 shrink-0" />
            <FormattedMessage id="AUTH.SIGNUP.CONTINUE_WITH_GOOGLE" />
          </button>

        </div>

        <div className="flex items-center gap-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            <FormattedMessage id="AUTH.SIGNUP.OR" />
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">
            <FormattedMessage id="AUTH.SIGNUP.EMAIL" />
          </label>
          <label className="input">
            <input
              placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.PLACEHOLDER_EMAIL' })}
              // type="email"
              type="text"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setStatus("");
              }}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">
            <FormattedMessage id="AUTH.SIGNUP.PASSWORD" />
          </label>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.PLACEHOLDER_PASSWORD' })}
              autoComplete="off"
              {...formik.getFieldProps('password')}
              onChange={(e) => {
                formik.handleChange(e);
                formik.setStatus("");
              }}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password
                }
              )}
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

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">
            <FormattedMessage id="AUTH.SIGNUP.CONFIRM_PASSWORD" />
          </label>
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.PLACEHOLDER_CONFIRM_PASSWORD' })}
              autoComplete="off"
              {...formik.getFieldProps('changepassword')}

              onChange={(e) => {
                formik.handleChange(e);
                formik.setStatus("");
              }}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword
                }
              )}
            />
            <button type="button" className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showConfirmPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
              />
            </button>
          </label>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.changepassword}
            </span>
          )}
        </div>


        {/* 
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={formik.values.acceptTerms}
              onChange={(e) => formik.setFieldValue("acceptTerms", e.target.checked)}
              onBlur={() => formik.setFieldTouched("acceptTerms", true)}
            />

            <span className="checkbox-label leading-tight">
              I accept{" "}
              <a
                href="https://growondaily.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2sm link"
              >
                Terms & Conditions
              </a>
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>

          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <span role="alert" className="text-danger text-xs ml-6">
              {formik.errors.acceptTerms}
            </span>
          )}
        </div> */}

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">

            {/* Checkbox – ONLY this toggles */}
            <input
              type="checkbox"
              className="checkbox checkbox-sm cursor-pointer"
              checked={formik.values.acceptTerms}
              onChange={() =>
                formik.setFieldValue("acceptTerms", !formik.values.acceptTerms)
              }
              onBlur={() => formik.setFieldTouched("acceptTerms", true)}
            />

            {/* Text – ONLY this toggles (not empty space) */}
            <span
              className="checkbox-label leading-tight cursor-pointer"
              onClick={() =>
                formik.setFieldValue("acceptTerms", !formik.values.acceptTerms)
              }
            >
              <FormattedMessage id="AUTH.SIGNUP.ACCEPT_TERMS" />{" "}
              <a
                href="https://growondaily.com/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2sm link"
                onClick={(e) => e.stopPropagation()}
              >
                <FormattedMessage id="AUTH.SIGNUP.TERMS_CONDITIONS" />
              </a>
              <span className="text-red-500 ml-1">*</span>
            </span>

          </div>

          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <span role="alert" className="text-danger text-xs ml-6">
              {formik.errors.acceptTerms}
            </span>
          )}
        </div>



        <button
          type="submit"
          className="btn btn-primary flex justify-center grow  disabled:cursor-pointer"
          disabled={loading || formik.isSubmitting}
        >
          {/* {loading ? 'Please wait...' : 'Sign UP'} */}
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {/* <span>Signing up...</span> */}
            </div>
          ) : (
            intl.formatMessage({ id: 'AUTH.SIGNUP.BUTTON' })
          )}

        </button>
      </form>
    </div>
  );
};

export { Signup };