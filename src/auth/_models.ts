import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  access_token: string;
  refreshToken?: string;
  api_token: string;
}

export interface UserModel {
  // id: number;
  // username: string;
  // password: string | undefined;
  // email: string;
  // first_name: string;
  // last_name: string;
  // fullname?: string;
  // occupation?: string;
  // companyName?: string;
  // phone?: string;
  // roles?: number[];
  // pic?: string;
  // language?: TLanguageCode;
  // auth?: AuthModel;

  user_id:string;
  first_name:string;
  last_name:string;
  email:string;
  role:string;
  profile_picture:string;
  is_preference_setup_done:boolean;
  is_profile_setup_done:boolean;
  auth_provider:string;
  auth?: AuthModel;
  preferences?: any;


}
