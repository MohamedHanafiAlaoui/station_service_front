export class Api {
  public static readonly BASE = 'http://localhost:8080/api';

  public static readonly AUTH = `${Api.BASE}/auth`;
  public static readonly LOGIN = `${Api.AUTH}/login`;
  public static readonly REGISTER = `${Api.AUTH}/register`;

  public static readonly USERS = `${Api.BASE}/users`;

  public static readonly CLIENTS = `${Api.BASE}/clients`;

  public static readonly STATIONS = `${Api.BASE}/stations`;

  public static readonly POMPES = `${Api.BASE}/pompes`;

  public static readonly VENTES = `${Api.BASE}/ventes`;

  public static readonly APPROVISIONNEMENTS = `${Api.BASE}/approvisionnements`;
}
