const User = require('../models/User');
const bcrypt = require('bcryptjs');


//OBTENER TODOS LOS USUARIOS
const getUsers = (req, res) => {

  User.findAndCountAll({

    attributes: ['id', 'name', 'lastName', 'email']

  }).then( users => {

    res.json(users)

  }).catch( err => {

    res.json({
      ok: false,
      msg: 'Error inesperado...'
    });

  })

}

//CREAR UN USUARIO
const createUser = (req, res) => {
  
  const { name, lastName, email, password } = req.body;

  //Verificamos si el email ya existe
  User.findOne({
    where: {
      email: email
    }

  }).then( result => {

    if (result) {

      return res.status(400).json({
        ok: false,
        msg: 'El email ya esta registrado.'
      });

    } else {

      //encriptamos el password
      const salt = bcrypt.genSaltSync();
      passEncrypted = bcrypt.hashSync(password, salt);

      //Creamos el usuario
      User.create({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passEncrypted

      }).then( user => {

        res.json({
          ok: true,
          user: user
        })

      }).catch( err => {

        res.json({
          ok: false,
          msg: err.errors[0].message
        });

      })

    }

  })

}

//OBTENER UN USUARIO
const getUser = (req, res) => {

  User.findByPk(
    req.params.id, 
    {attributes: ['id', 'name', 'lastName', 'email']}

  ).then( user => {

    if (user === null) {
      res.json({
        ok: false,
        msg: 'usuario no encontrado.'
      })

    } else {
      res.json(user)

    }

  }).catch( err => {

    res.json({
      ok: false,
      msg: 'Error inesperado.'
    });

  })
  
}

//EDITAR UN USUARIO
const updateUser = (req, res) => {

  User.update({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email

  }, {
    where: {
      id: req.params.id
    }

  }).then( result => {

    if (result[0] === 1) {
      res.json({
        ok: true,
        msg: 'usuario actualizado.'
      })

    } else {
      res.json({
        ok: false,
        msg: 'no se pudo actualizar el usuario.'
      })

    }


  }).catch( err => {

    res.json({
      ok: false,
      msg: err.errors[0].message
    });

  })

}

//BORRAR UN USUARIO
const deleteUser = (req, res) => {

  User.destroy({
    where: {
      id: req.params.id
    }

  //result devuelve un numero que representa la cantidad de items borrados
  }).then( result => {

    if (result >= 1) {
      res.json({
        ok: true,
        msg: 'usuario borrado con exito.'
      })

    } else {
      res.json({
        ok: false,
        msg: 'no se pudo borrar el usuario.'
      })

    }

  }).catch( err => {

    res.json({
      ok: false,
      msg: 'Error inesperado.'
    });

  })

}





module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
}