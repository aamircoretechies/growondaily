import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import { KeenIcon, Alert } from '@/components';
import { useLayout } from '@/providers';
import { useAuthContext } from '@/auth';
import { useIntl, FormattedMessage } from 'react-intl';

const getForgotPasswordSchema = (intl: any) => Yup.object().shape({
  email: Yup.string()
    // .matches(/^[A-Z0-9._%+-]+@gmail\.com$/i, 'Please enter a valid Gmail address.')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, intl.formatMessage({ id: 'AUTH.VALIDATION.INVALID_EMAIL' }))
    .required(intl.formatMessage({ id: 'AUTH.VALIDATION.EMAIL_REQUIRED' }))
});

const ResetPasswordEnterEmail = () => {
  const { currentLayout } = useLayout();
  const { requestPasswordResetLink } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const forgotPasswordSchema = getForgotPasswordSchema(intl);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const response = await requestPasswordResetLink(values.email);
        if (response?.success) {
          navigate(
            currentLayout?.name === 'auth-branded'
              ? `/auth/reset-password/check-email?email=${values.email}`
              : `/auth/classic/reset-password/check-email?email=${values.email}`
          );
        } else {
          setStatus(response?.message || 'Invalid email. No account found with this email address.');
          setSubmitting(false);
          setLoading(false);
        }
      } catch (error: any) {
        console.error(error);
        setStatus(error.response?.data?.message || 'Failed to send reset link. Please try again.');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            <FormattedMessage id="AUTH.RESET_PASSWORD.ENTER_EMAIL.TITLE" />
          </h3>
          <span className="text-2sm text-gray-700">
            <FormattedMessage id="AUTH.RESET_PASSWORD.ENTER_EMAIL.DESC" />
          </span>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            <FormattedMessage id="AUTH.RESET_PASSWORD.ENTER_EMAIL.EMAIL" />
          </label>
          <input
            className={clsx('input', {
              'is-invalid': formik.touched.email && formik.errors.email
            })}
            type="email"
            placeholder={intl.formatMessage({ id: 'AUTH.SIGNUP.PLACEHOLDER_EMAIL' })}
            autoComplete="off"
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting || !formik.isValid || !formik.dirty}
        >
          {loading ? intl.formatMessage({ id: 'AUTH.GENERAL.PLEASE_WAIT' }) : intl.formatMessage({ id: 'AUTH.RESET_PASSWORD.ENTER_EMAIL.BUTTON' })}
          {!loading && <KeenIcon icon="black-right" />}
        </button>
      </form>
    </div>
  );
};

export { ResetPasswordEnterEmail };
