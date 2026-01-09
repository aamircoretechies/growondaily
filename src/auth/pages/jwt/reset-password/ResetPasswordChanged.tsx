import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { useLayout } from '@/providers';
import { FormattedMessage } from 'react-intl';

const ResetPasswordChanged = () => {
  const { currentLayout } = useLayout();

  return (
    <div className="card max-w-[440px] w-full">
      <div className="card-body p-10">
        <div className="flex justify-center mb-5">
          <img
            src={toAbsoluteUrl('/media/illustrations/32.svg')}
            className="dark:hidden max-h-[180px]"
            alt=""
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/32-dark.svg')}
            className="light:hidden max-h-[180px]"
            alt=""
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          <FormattedMessage id="AUTH.RESET_PASSWORD.CHANGED.TITLE" />
        </h3>
        <div className="text-2sm text-center text-gray-700 mb-7.5">
          <FormattedMessage id="AUTH.RESET_PASSWORD.CHANGED.MSG" />
          <br />
          <FormattedMessage id="AUTH.RESET_PASSWORD.CHANGED.MSG_SECURITY" />
        </div>

        <div className="flex justify-center">
          <Link
            to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
            className="btn btn-primary"
          >
            <FormattedMessage id="AUTH.RESET_PASSWORD.CHANGED.BUTTON" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export { ResetPasswordChanged };
