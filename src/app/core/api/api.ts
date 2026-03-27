export class Api {
  public static readonly BASE = 'http://localhost:8080/api';
  public static readonly AUTH = `${Api.BASE}/auth`;
  public static readonly LOGOUT = `${Api.AUTH}/logout`;
  public static readonly LOGIN = `${Api.AUTH}/login`;
  public static readonly REGISTER = `${Api.AUTH}/register`;
  public static readonly REGISTER_EMPLOYE = `${Api.AUTH}/register/Employe`;
  public static readonly CHANGE_PASSWORD = `${Api.AUTH}/change-password`;
  public static readonly RESET_PASSWORD = (id: number) => `${Api.AUTH}/reset-password/${id}`;
  public static readonly EMPLOYES = `${Api.AUTH}/employes`;
  public static readonly USERS = `${Api.BASE}/users`;
  public static readonly UPDATE_NAME = (id: number) => `${Api.AUTH}/update/${id}`;
  public static readonly CLIENTS = `${Api.BASE}/clients`;
  public static readonly STATIONS = `${Api.BASE}/stations`;
  public static readonly PUBLIC_STATIONS = `${Api.STATIONS}/public`;
  public static readonly POMPES = `${Api.BASE}/pompes`;
  public static readonly VENTES = `${Api.BASE}/ventes`;
  public static readonly APPROVISIONNEMENTS = `${Api.BASE}/approvisionnements`;
  public static readonly JOURNALS = `${Api.BASE}/journals`;
  public static readonly BADGE = `${Api.BASE}/badge`;
}