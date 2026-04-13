import { SvgIconProps, SxProps, Theme } from '@mui/material';
import { useIconSettings } from './UISettingsContext';

export const useIconSx = (): { 
  color: SxProps<Theme>['color']; 
} => {
  const { iconColor } = useIconSettings();
  
  return {
    color: iconColor === 'current' ? 'currentColor' : iconColor as 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error'
  };
};

interface AppIconProps extends SvgIconProps {
  FilledIcon?: React.ElementType<SvgIconProps>;
  OutlinedIcon?: React.ElementType<SvgIconProps>;
}

export const AppIcon = ({ 
  FilledIcon, 
  OutlinedIcon, 
  ...props 
}: AppIconProps) => {
  const { iconStyle, iconColor } = useIconSettings();

  const IconComponent = iconStyle === 'outlined' && OutlinedIcon 
    ? OutlinedIcon 
    : FilledIcon;

  if (!IconComponent) {
    return null as React.ReactElement;
  }

  return (
    <IconComponent 
      {...props} 
      color={iconColor as any}
    />
  );
};