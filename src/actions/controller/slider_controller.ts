import { sliders } from '@/actions/data/sliders';

function getNextId() {
  return sliders.length ? Math.max(...sliders.map(s => s.id)) + 1 : 1;
}

export const sliderController = {
  // Get all sliders in a specific category
  getSliderByCategory(category: string) {
    return sliders.filter((s: any) => s.category === category).reverse();
  },

  // Insert a new slider
  insertSlider(slider: any) {
    const newSlider = {
      ...slider,
      id: getNextId(),
      createdAt: new Date().toISOString(),
    };
    sliders.push(newSlider);
    return newSlider;
  },

  // Edit a slider by ID
  editSlider(id: number, updatedFields: any) {
    const index = sliders.findIndex((s: any) => s.id === id);
    if (index === -1) return null;
    sliders[index] = { ...sliders[index], ...updatedFields };
    return sliders[index];
  },

  // Delete a slider by ID
  deleteSlider(id: number) {
    const index = sliders.findIndex((s: any) => s.id === id);
    if (index === -1) return false;
    sliders.splice(index, 1);
    return true;
  }
};