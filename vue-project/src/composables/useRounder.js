const useRounder = () => {
  const rounder = value => Math.round(value);

  return { rounder }
}

export default useRounder;
