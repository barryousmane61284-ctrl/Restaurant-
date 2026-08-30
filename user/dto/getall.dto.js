//dto de recuperation de tous les utilisateurs
class GetAllUsersDto {
  constructor(id, nom, email, prenom) {
    this.id = id;
    this.nom = nom;
    this.email = email;
    this.prenom = prenom;
  }
}
export default GetAllUsersDto;