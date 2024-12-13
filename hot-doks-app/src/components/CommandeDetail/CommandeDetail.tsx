import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCell,
  ActionHeaderCell,
  ActionCell,
  CondimentCell,
  CondimentHeaderCell,
  CommentHeaderCell,
  CommentCell,
} from '../../styles/globalStyles';
import Button from '../Button/Button';

export interface HotDog {
  id: number | null;
  type: 'CLASSIC' | 'ALSACE' | 'NEWYORK';
  withKetchup: boolean;
  withMustard: boolean;
  withMayo: boolean;
  withOnions: boolean;
  isVege: boolean;
  comment: string | null;
  price: number;
}

export interface Order {
  id: number | null;
  orderStatus: string | null;
  orderedBy: string | null;
  preparedBy: string | null;
  orderTime: string | null;
  preparationTime: string | null;
  customerName: string | null;
  paymentType: 'CASH' | 'CARD' | null;
  hotdogs: HotDog[];
  preparationMinutes: number | null;
  totalPrice: number;
}

interface CommandeDetailProps {
  readOnly?: boolean;
  order: Order;
  onOrderChange?: (order: Order) => void;
}

const CommandeSection = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: auto;
`;

const SummarySection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TilesContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  width: 400px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

interface TileProps {
  backgroundColor: string;
}

const Tile = styled.div<TileProps>`
  position: relative;
  width: 180px;
  height: 80px;
  background: ${props => props.backgroundColor};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TileLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Badge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
`;

const DetailSection = styled.div`
  flex: 1;
  overflow-y: auto;
`;

interface TableDividerProps {
  $backgroundColor: string;
}

const TableDivider = styled.tr<TableDividerProps>`
  background-color: ${props => props.$backgroundColor};
`;

const DividerCell = styled.td`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
`;

interface StyledTableRowProps {
  $isVege?: boolean;
}

const StyledTableRow = styled.tr<StyledTableRowProps>`
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
  background-color: ${props => props.$isVege ? '#E8F5E9' : 'transparent'};
`;

const getCheckboxColor = (type: 'ketchup' | 'mustard' | 'mayo' | 'onions' | 'vege') => {
  switch (type) {
    case 'ketchup':
      return '#FF0000'; // red
    case 'mustard':
      return '#FFD700'; // yellow
    case 'mayo':
      return '#F5E6D3'; // light beige
    case 'onions':
      return '#3E2723'; // dark brown
    case 'vege':
      return '#4CAF50'; // green
    default:
      return '#000000';
  }
};

interface StyledCheckboxProps {
  condimentType: 'ketchup' | 'mustard' | 'mayo' | 'onions' | 'vege';
}

const StyledCheckbox = styled.input.attrs({ 
  type: 'checkbox' 
})<StyledCheckboxProps>`
  width: 28px;
  height: 28px;
  cursor: pointer;
  accent-color: ${props => props.condimentType === 'vege' ? '#4CAF50' : getCheckboxColor(props.condimentType)};
  position: relative;
  appearance: none;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  outline: none;
  transition: all 0.2s ease;

  &:checked {
    background-color: ${props => props.condimentType === 'vege' ? '#4CAF50' : getCheckboxColor(props.condimentType)};
    border-color: ${props => props.condimentType === 'vege' ? '#4CAF50' : getCheckboxColor(props.condimentType)};
  }

  &:checked::before {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
  }

  &:hover {
    border-color: ${props => props.condimentType === 'vege' ? '#4CAF50' : getCheckboxColor(props.condimentType)};
  }
`;

const RemoveIcon = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error};
  font-size: 20px;
`;

const CommentIcon = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radii.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  min-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const CommentContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CommentText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const PopupTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  resize: vertical;
  margin: ${({ theme }) => theme.spacing.sm} 0;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyledPopupTextArea = styled(PopupTextArea)`
  padding-right: ${({ theme }) => theme.spacing.xl};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ClearIcon = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const PredefinedCommentsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const PredefinedCommentLabel = styled.span`
  background-color: #4A148C;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #6A1B9A;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const CommandeDetail: React.FC<CommandeDetailProps> = ({ readOnly = false, order, onOrderChange }) => {
  const orderCounts = React.useMemo(() => ({
    classic: order.hotdogs.filter(item => item.type === 'CLASSIC').length,
    alsace: order.hotdogs.filter(item => item.type === 'ALSACE').length,
    newYork: order.hotdogs.filter(item => item.type === 'NEWYORK').length,
  }), [order.hotdogs]);

  const [activeCommentId, setActiveCommentId] = React.useState<number | null>(null);
  const commentInputRef = React.useRef<HTMLTextAreaElement>(null);

  const predefinedComments = [
    "Pas trop de choucroute ",
    "Pas trop de sauce ",
    "Beaucoup de choucroute ",
    "Beaucoup de sauce "
  ];

  const handleRemoveItem = (id: number) => {
    if (readOnly) return;
    const updatedOrder = {
      ...order,
      hotdogs: order.hotdogs.filter(item => item.id !== id)
    };
    onOrderChange?.(updatedOrder);
  };

  const handleToggleCondiment = (id: number, field: keyof Pick<HotDog, 'withKetchup' | 'withMustard' | 'withMayo' | 'withOnions' | 'isVege'>) => {
    if (readOnly) return;
    const updatedOrder = {
      ...order,
      hotdogs: order.hotdogs.map(item =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    };
    onOrderChange?.(updatedOrder);
  };

  const handleCommentChange = (id: number, comment: string) => {
    if (readOnly) return;
    const updatedOrder = {
      ...order,
      hotdogs: order.hotdogs.map(item =>
        item.id === id ? { ...item, comment } : item
      )
    };
    onOrderChange?.(updatedOrder);
  };

  const handleCustomerNameChange = (customerName: string) => {
    if (readOnly) return;
    const updatedOrder = {
      ...order,
      customerName
    };
    onOrderChange?.(updatedOrder);
  };

  const handleTileClick = (type: 'CLASSIC' | 'ALSACE' | 'NEWYORK') => {
    if (readOnly) return;
    const updatedOrder = {
      ...order,
      hotdogs: [...order.hotdogs, {
        id: Date.now(),
        type,
        withKetchup: false,
        withMustard: false,
        withMayo: false,
        withOnions: type === 'NEWYORK', // Set to true for New-York hotdogs
        isVege: false,
        comment: null,
        price: 0
      }]
    };
    onOrderChange?.(updatedOrder);
  };

  const handleCommentIconClick = (id: number) => {
    if (readOnly) return;
    setActiveCommentId(activeCommentId === id ? null : id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      setActiveCommentId(null);
    }
  };

  const handleClickOutside = () => {
    setActiveCommentId(null);
  };

  const handleClearComment = (id: number) => {
    if (readOnly) return;
    const updatedOrder = {
      ...order,
      hotdogs: order.hotdogs.map(item =>
        item.id === id ? { ...item, comment: '' } : item
      )
    };
    onOrderChange?.(updatedOrder);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handlePredefinedCommentClick = (comment: string, id: number) => {
    if (readOnly) return;
    const hotdog = order.hotdogs.find(item => item.id === id);
    if (!hotdog) return;

    const existingComment = hotdog.comment || '';
    const newComment = existingComment 
      ? existingComment.endsWith('.') 
        ? `${existingComment} ${comment}`
        : `${existingComment}. ${comment}`
      : comment;

    const updatedOrder = {
      ...order,
      hotdogs: order.hotdogs.map(item =>
        item.id === id ? { ...item, comment: newComment } : item
      )
    };
    onOrderChange?.(updatedOrder);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (activeCommentId && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [activeCommentId]);

  return (
    <CommandeSection>
      <SummarySection>
        <TilesContainer>
          <Tile onClick={() => handleTileClick('CLASSIC')} backgroundColor="#FFCCCB">
            <TileLabel>Classic</TileLabel>
            {orderCounts.classic > 0 && <Badge>{orderCounts.classic}</Badge>}
          </Tile>
          <Tile onClick={() => handleTileClick('ALSACE')} backgroundColor="#E1C7B7">
            <TileLabel>Alsace</TileLabel>
            {orderCounts.alsace > 0 && <Badge>{orderCounts.alsace}</Badge>}
          </Tile>
          <Tile onClick={() => handleTileClick('NEWYORK')} backgroundColor="#FFE0B2">
            <TileLabel>New-York</TileLabel>
            {orderCounts.newYork > 0 && <Badge>{orderCounts.newYork}</Badge>}
          </Tile>
        </TilesContainer>
        <InputGroup>
          <InputLabel>Nom:</InputLabel>
          <Input 
            type="text"
            value={order.customerName || ''}
            onChange={(e) => handleCustomerNameChange(e.target.value)}
            placeholder="Nom du client"
            disabled={readOnly}
          />
        </InputGroup>
      </SummarySection>

      <DetailSection>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <ActionHeaderCell></ActionHeaderCell>
                <CondimentHeaderCell>Végé</CondimentHeaderCell>
                <CondimentHeaderCell>Ketchup</CondimentHeaderCell>
                <CondimentHeaderCell>Moutarde</CondimentHeaderCell>
                <CondimentHeaderCell>Mayo</CondimentHeaderCell>
                <CondimentHeaderCell>Oignons</CondimentHeaderCell>
                <CommentHeaderCell>Commentaire</CommentHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {(['CLASSIC', 'ALSACE', 'NEWYORK'] as const).map(type => {
                const typeItems = order.hotdogs.filter(item => item.type === type);
                if (typeItems.length === 0) return null;
                
                return (
                  <React.Fragment key={type}>
                    <TableDivider
                      $backgroundColor={
                        type === 'CLASSIC' 
                          ? '#FFCCCB' 
                          : type === 'ALSACE' 
                            ? '#E1C7B7' 
                            : '#FFE0B2'
                      }
                    >
                      <DividerCell colSpan={7}>
                        {type === 'CLASSIC' ? 'Classic' : type === 'ALSACE' ? 'Alsace' : 'New-York'}
                      </DividerCell>
                    </TableDivider>
                    {typeItems.map((item) => (
                      <StyledTableRow key={item.id} $isVege={item.isVege}>
                        <ActionCell>
                          {!readOnly && (
                            <RemoveIcon
                              className="material-icons"
                              onClick={() => item.id && handleRemoveItem(item.id)}
                            >
                              remove_circle
                            </RemoveIcon>
                          )}
                        </ActionCell>
                        <CondimentCell>
                          <StyledCheckbox
                            condimentType="vege"
                            checked={item.isVege}
                            onChange={() => item.id && handleToggleCondiment(item.id, 'isVege')}
                            disabled={readOnly}
                          />
                        </CondimentCell>
                        <CondimentCell>
                          <StyledCheckbox
                            condimentType="ketchup"
                            checked={item.withKetchup}
                            onChange={() => item.id && handleToggleCondiment(item.id, 'withKetchup')}
                            disabled={readOnly}
                          />
                        </CondimentCell>
                        <CondimentCell>
                          <StyledCheckbox
                            condimentType="mustard"
                            checked={item.withMustard}
                            onChange={() => item.id && handleToggleCondiment(item.id, 'withMustard')}
                            disabled={readOnly}
                          />
                        </CondimentCell>
                        <CondimentCell>
                          <StyledCheckbox
                            condimentType="mayo"
                            checked={item.withMayo}
                            onChange={() => item.id && handleToggleCondiment(item.id, 'withMayo')}
                            disabled={readOnly}
                          />
                        </CondimentCell>
                        <CondimentCell>
                          <StyledCheckbox
                            condimentType="onions"
                            checked={item.withOnions}
                            onChange={() => item.id && handleToggleCondiment(item.id, 'withOnions')}
                            disabled={readOnly}
                          />
                        </CondimentCell>
                        <CommentCell>
                          {readOnly ? (
                            <CommentText>{item.comment || ''}</CommentText>
                          ) : (
                            <CommentContainer onClick={(e) => e.stopPropagation()}>
                              <CommentIcon 
                                className="material-icons"
                                onClick={() => item.id && handleCommentIconClick(item.id)}
                              >
                                {item.comment ? 'edit_note' : 'add_comment'}
                              </CommentIcon>
                              {item.comment && (
                                <CommentText>{item.comment}</CommentText>
                              )}
                              <ModalOverlay 
                                isVisible={item.id === activeCommentId}
                                onClick={() => setActiveCommentId(null)}
                              >
                                <ModalContent onClick={(e) => e.stopPropagation()}>
                                  <FormGroup>
                                    <FormLabel htmlFor={`comment-${item.id}`}>Commentaire</FormLabel>
                                    <InputWrapper>
                                      <StyledPopupTextArea
                                        id={`comment-${item.id}`}
                                        ref={commentInputRef}
                                        value={item.comment || ''}
                                        onChange={(e) => item.id && handleCommentChange(item.id, e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ajouter un commentaire"
                                        rows={3}
                                      />
                                      {item.comment && (
                                        <ClearIcon
                                          className="material-icons"
                                          onClick={() => item.id && handleClearComment(item.id)}
                                        >
                                          clear
                                        </ClearIcon>
                                      )}
                                    </InputWrapper>
                                    <PredefinedCommentsContainer>
                                      {predefinedComments.map((comment, index) => (
                                        <PredefinedCommentLabel
                                          key={index}
                                          onClick={() => item.id && handlePredefinedCommentClick(comment, item.id)}
                                        >
                                          {comment}
                                        </PredefinedCommentLabel>
                                      ))}
                                    </PredefinedCommentsContainer>
                                    <Button
                                      icon="add"
                                      onClick={() => setActiveCommentId(null)}
                                      style={{ width: '100%', marginTop: '16px' }}
                                    >
                                      Ajouter le commentaire
                                    </Button>
                                  </FormGroup>
                                </ModalContent>
                              </ModalOverlay>
                            </CommentContainer>
                          )}
                        </CommentCell>
                      </StyledTableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
      </DetailSection>
    </CommandeSection>
  );
};

export default CommandeDetail;
