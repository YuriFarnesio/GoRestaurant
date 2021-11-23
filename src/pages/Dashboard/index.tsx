import { useEffect, useState } from 'react';

import api from '../../services/api';
import { IFood } from '../../types';

import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<IFood[]>('foods');

      setFoods(response.data);
    };

    loadFoods();
  }, []);

  async function handleAddFood(food: Omit<IFood, 'id' | 'available'>) {
    try {
      const { name, image, price, description } = food;

      const response = await api.post('/foods', {
        name,
        image,
        price,
        description,
        available: true
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    };
  }

  async function handleUpdateFood(food: Omit<IFood, 'id' | 'available'>) {
    try {
      const response = await api.put(`/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food
        },
      );

      const foodsUpdated = foods.map(food =>
        food.id !== response.data.id ? food : response.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    };
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFood) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
