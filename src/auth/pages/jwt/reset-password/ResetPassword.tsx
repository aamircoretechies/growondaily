import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '@/auth/useAuthContext';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';

const initialValues = {
  email: ''
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Please enter a valid email address.'
    )
    .required('Email is required')
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const { requestPasswordResetLink } = useAuthContext();
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      try {
        if (!requestPasswordResetLink) {
          throw new Error('JWTProvider is required for this form.');
        }
        const response = await requestPasswordResetLink(values.email);

        // if (response?.success) {
        //   setHasErrors(false);
        //   setLoading(false);
        //   const params = new URLSearchParams();
        //   params.append('email', values.email);
        //   navigate({
        //     pathname:
        //       currentLayout?.name === 'auth-branded'
        //         ? '/auth/reset-password/check-email'
        //         : '/auth/classic/reset-password/check-email',
        //     search: params.toString()
        //   });
        // } else {
        //   setStatus(response?.message || 'Invalid email. No account found with this email address.');
        //   setHasErrors(true);
        //   setLoading(false);
        // }


        if (response?.status === 1) {
          setHasErrors(false);   // show green alert
          setLoading(false);

          const params = new URLSearchParams();
          params.append('email', values.email);

          navigate({
            pathname:
              currentLayout?.name === 'auth-branded'
                ? '/auth/reset-password/check-email'
                : '/auth/classic/reset-password/check-email',
            search: params.toString()
          });
        } else {
          setStatus(response?.message || 'Invalid email. No account found');
          setHasErrors(true);
          setLoading(false);
        }

      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setStatus(error.response.data.message || 'Invalid email address');
        } else {
          setStatus('Invalid email address');
        }
        setHasErrors(true);
        setLoading(false);
        setSubmitting(false);
      }
    }
  });
  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Your Email</h3>
          <span className="text-2sm text-gray-600 font-medium">
            Enter your email to reset password
          </span>
        </div>

        {/* {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

        {hasErrors === false && (
          <Alert variant="success">
            Password reset link sent. Please check your email to proceed
          </Alert>
        )} */}

        {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

        {hasErrors === false && (
          <div className="alert bg-[#E8F5E9] border border-[#4CAF50] text-[#256029] rounded-lg p-4 flex items-start gap-3">
            <KeenIcon
              icon="check"
              className="text-[#4CAF50] text-xl mt-0.5"
            />
            <span className="text-sm">
              Password reset link sent. Please check your email to proceed
            </span>
          </div>
        )}


        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="email@email.com"
              autoComplete="off"
              {...formik.getFieldProps('email')}
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

        <div className="flex flex-col gap-5 items-stretch">
          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {/* {loading ? 'Please wait...' : 'Continue'} */}
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Continue"
            )}

          </button>

          <Link
            to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
            className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
          >
            <KeenIcon icon="black-left" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export { ResetPassword };
