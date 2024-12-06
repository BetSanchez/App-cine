import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { auth } from '../utils/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const UserProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPhotoModalVisible, setPhotoModalVisible] = useState(false); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [profilePicture, setProfilePicture] = useState(require('../assets/Juan.jpg')); 

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email);
      setUserId(user.uid);

      
      if (user.email && user.email.endsWith('@admin.com')) {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.navigate('MovieCatalog');
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const handleUpdateInfo = () => {
    setModalVisible(true);
    setStep(1);
  };

  const handleAdminAction = () => {
    if (isAdmin) {
      Alert.alert('Acción de Administrador', 'Realizando acción exclusiva para administradores.');
      navigation.navigate('AdminDashboard');
    }
  };

  const verifyCurrentPassword = async () => {
    const user = auth.currentUser;
    if (!currentPassword) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña actual.');
      return;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      setStep(2); 
    } catch (error) {
      console.error(error.message);
      Alert.alert('Error', 'La contraseña actual no es correcta.');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
      setModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStep(1); 
    } catch (error) {
      console.error(error.message);
      Alert.alert('Error', 'No se pudo actualizar la contraseña. Por favor, inténtalo nuevamente.');
    }
  };

  const handleProfilePictureChange = (image) => {
    setProfilePicture(image); 
    setPhotoModalVisible(false); 
  };

  const buttons = [
    {
      id: 'compras',
      title: 'Mis Compras',
      icon: 'shopping-cart',
      action: () => navigation.navigate('ComprasScreen', { userId }),
    },
    {
      id: 'update',
      title: 'Actualizar',
      icon: 'refresh',
      action: handleUpdateInfo,
    },
    ...(isAdmin
      ? [
          {
            id: 'admin',
            title: 'Admin',
            icon: 'lock',
            action: handleAdminAction,
          },
        ]
      : []),
    {
      id: 'logout',
      title: 'Cerrar Sesión',
      icon: 'sign-out',
      action: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      {userName ? (
        <Text style={styles.userName}>{userName}</Text>
      ) : (
        <Text style={styles.userName}>Cargando...</Text>
      )}

      <TouchableOpacity onPress={() => setPhotoModalVisible(true)}>
        <Image
          source={profilePicture}
          style={styles.userImage}
        />
      </TouchableOpacity>

      <View style={styles.gridContainer}>
        {buttons.map(button => (
          <TouchableOpacity
            key={button.id}
            style={[styles.button, button.disabled && styles.buttonDisabled]}
            onPress={button.action}
            disabled={button.disabled}
          >
            <Icon name={button.icon} size={20} color="#FFF" />
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {step === 1 ? (
              <>
                <Text style={styles.modalTitle}>Verifica tu Contraseña Actual</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña Actual"
                  placeholderTextColor="#ffffff"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={verifyCurrentPassword}
                  >
                    <Text style={styles.modalButtonText}>Siguiente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Cambia tu Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nueva Contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Repetir Nueva Contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handlePasswordChange}
                  >
                    <Text style={styles.modalButtonText}>Actualizar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPhotoModalVisible}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerPerfil}>
            <Text style={styles.modalTitlePerfil}>Selecciona una Foto de Perfil</Text>
            <View style={styles.photoOptions}>
              <TouchableOpacity onPress={() => handleProfilePictureChange(require('../assets/Juan.jpg'))}>
                <Image source={require('../assets/Juan.jpg')} style={styles.profileOptionImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleProfilePictureChange(require('../assets/Juana.jpg'))}>
                <Image source={require('../assets/Juana.jpg')} style={styles.profileOptionImage} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setPhotoModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  userName: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  userImage: {
    width: 250,
    height: 250,
    borderRadius: 550,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#6A1B9A',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#1c072b',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#e0e0e0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#6A1B9A',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#ffffff',
  },
  modalContainerPerfil: {
    backgroundColor: '#1c072b',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitlePerfil: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  profileOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default UserProfileScreen;
