//dto de recuperation de tous les utilisateurs
class GetAllUsersDto {
  constructor(id, nom, email, prenom, telephone, role, image) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.telephone = telephone;
    this.role = role;
    this.image = image;
  }
}
export default GetAllUsersDto;